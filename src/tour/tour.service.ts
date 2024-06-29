import { DestinationService } from '@/destination/destination.service';
import { EventlogService } from '@/eventlog/eventlog.service';
import { PricesService } from '@/prices/prices.service';
import { PaginationDTO } from '@/shared/dtos/pagination.dto';
import { MOVES } from '@/shared/enums/moves.enum';
import { UserRoles } from '@/shared/enums/roles';
import { SalesMove } from '@/shared/enums/sales/salemove.enum';
import { ChangeTourStatusDTO } from '@/shared/enums/searcher/tour/changeStatus.dto';
import { SearcherTourDTO } from '@/shared/enums/searcher/tour/searcher.dto';
import { BoxLunch } from '@/shared/enums/tour/boxlunch.enum';
import { TourStatus } from '@/shared/enums/tour/status.enum';
import { TourExcel } from '@/shared/interfaces/excel/tour.excel.interface';
import { PaginateResult } from '@/shared/interfaces/paginate.interface';
import { TourLean } from '@/shared/interfaces/tour/tour.lean.interface';
import { User } from '@/shared/interfaces/user/user.interface';
import { CreateEventLogDTO } from '@/shared/models/dtos/request/eventlog/eventlog.dto';
import { AboardHourDTO } from '@/shared/models/dtos/request/tour/aboardhour.dto';
import { CreateTourDTO } from '@/shared/models/dtos/request/tour/createtour.dto';
import { GetTourCatalogDTO } from '@/shared/models/dtos/request/tour/getTourCatalog.dto';
import { UpdateTourDTO } from '@/shared/models/dtos/request/tour/updatetour.dto';
import { PaginatedTourDTO } from '@/shared/models/dtos/response/tour/paginatedTour.dto';
import { Tours, TourDocument } from '@/shared/models/schemas/tour.schema';
import {
  createPaginatedObject,
  handleErrorsOnServices,
} from '@/shared/utilities/helpers';
import {
  createQueryForCatalog,
  pipelinesMaker,
} from '@/shared/utilities/tour-query-maker.helper';
import { DestinationValidator } from '@/shared/validators/destination.validator';
import { UrlValidator } from '@/shared/validators/urlValidator.dto';
import { TourtypeService } from '@/tourtype/tourtype.service';
import { TransportsService } from '@/transports/transports.service';
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class TourService {
  constructor(
    @InjectModel(Tours.name) private readonly tourModel: Model<Tours>,
    private readonly eventLogService: EventlogService,
    private readonly destinationService: DestinationService,
    private readonly transportService: TransportsService,
    private readonly tourTypeService: TourtypeService,
    private readonly priceService: PricesService,
  ) {}

  private readonly logger = new Logger(TourService.name);

  private async saveLogInDataBase({
    serviceId,
    move,
    user,
    registry,
  }: CreateEventLogDTO) {
    try {
      const service = TourService.name;
      const createEventLogDTO = new CreateEventLogDTO(
        serviceId,
        service,
        move,
        user,
        registry,
      );
      await this.eventLogService.saveLog(createEventLogDTO);
      this.logger.debug(`${user} ${move} a tour`);
    } catch (error) {
      throw handleErrorsOnServices('Error saving log in database.', error);
    }
  }

  async createTour(
    tour: CreateTourDTO,
    user = UserRoles.DEVELOP,
  ): Promise<Tours> {
    try {
      const newTour = new this.tourModel(tour);
      await newTour.save();
      await this.saveLogInDataBase({
        serviceId: newTour._id.toString(),
        move: MOVES.CREATE,
        user: user,
        registry: newTour,
      });
      return newTour;
    } catch (error: any) {
      throw handleErrorsOnServices(
        'Something went wrong creating tour.',
        error,
      );
    }
  }

  async findAll({
    page,
    limit,
    status,
  }: PaginatedTourDTO): Promise<PaginateResult<Tours>> {
    try {
      const query = status ? { status } : {};
      const docs = await this.tourModel
        .find(query)
        .limit(limit)
        .skip(limit * (page - 1))
        .populate([
          'destination',
          'transport',
          'tourType',
          'included',
          'itinerary',
        ])
        .populate({
          path: 'aboardHour.aboardPoint',
          model: 'AboardPoints',
        })
        .populate({
          path: 'returnHour.aboardPoint',
          model: 'AboardPoints',
        })
        .populate({
          path: 'departure',
          options: {
            sort: {
              date: 1,
              hour: 1,
            },
          },
        })
        .exec();
      if (docs.length === 0)
        throw new NotFoundException('No tours registered.');
      const totalDocs = await this.tourModel.countDocuments(query).exec();

      return createPaginatedObject<Tours>(docs, totalDocs, page, limit);
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong getting all tours.',
        error,
      );
    }
  }

  async findOne({ id }: UrlValidator): Promise<TourLean> {
    try {
      const tour = await this.tourModel
        .findById(id)
        .populate([
          'transport',
          'tourType',
          'included',
          'itinerary',
          'departure',
        ])
        .populate({
          path: 'destination',
          populate: {
            path: 'originCity',
            model: 'OriginCities',
            populate: {
              path: 'aboardPoints',
              model: 'AboardPoints',
            },
          },
        })
        .populate({
          path: 'aboardHour.aboardPoint',
          model: 'AboardPoints',
        })
        .populate({
          path: 'returnHour.aboardPoint',
          model: 'AboardPoints',
        })
        .populate({
          path: 'departure',
          options: {
            sort: {
              date: 1,
              hour: 1,
            },
          },
        })
        .select({ __v: 0, createdAt: 0 })
        .lean();

      if (!tour) throw new NotFoundException('Tour not found.');
      return tour;
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong getting tour by id.',
        error,
      );
    }
  }

  async getLastRegisteredTour({
    destination,
  }: DestinationValidator): Promise<TourLean> {
    try {
      const validDestination = await this.destinationService.validateFromTour({
        destination,
      });
      if (validDestination) {
        const tour = await this.tourModel
          .findOne({ destination })
          .sort({ createdAt: -1 })
          .populate([
            'destination',
            'transport',
            'tourType',
            'included',
            'itinerary',
            'departure',
          ])
          .populate({
            path: 'aboardHour.aboardPoint',
            model: 'AboardPoints',
          })
          .populate({
            path: 'returnHour.aboardPoint',
            model: 'AboardPoints',
          })
          .populate({
            path: 'departure',
            options: {
              sort: {
                date: 1,
                hour: 1,
              },
            },
          })
          .select({ __v: 0, createdAt: 0 })
          .limit(1)
          .lean();

        if (!tour) throw new NotFoundException('No tour registered.');
        return tour;
      }
      return {} as TourLean;
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong getting last registered tour.',
        error,
      );
    }
  }

  async updateTour(
    { id }: UrlValidator,
    updateTourDTO: UpdateTourDTO,
    user = UserRoles.DEVELOP,
  ) {
    try {
      const updatedTour = await this.tourModel.findByIdAndUpdate(
        id,
        updateTourDTO,
        {
          new: true,
        },
      );
      if (!updatedTour) throw new NotFoundException('Tour not found.');
      await this.saveLogInDataBase({
        serviceId: updatedTour._id.toString(),
        move: MOVES.UPDATE,
        user: user,
        registry: updatedTour,
      });
      return updatedTour;
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong updating tour.',
        error,
      );
    }
  }

  async changeTourStatus(
    { id, newStatus }: ChangeTourStatusDTO,
    user: string,
  ): Promise<TourLean | undefined> {
    try {
      const tour = await this.tourModel.findById(id);

      if (!tour) {
        throw new NotFoundException('Tour not found.');
      }

      this.validateNewTourStatus(newStatus, tour);

      const updatedTour = await this.tourModel.findByIdAndUpdate(id, {
        status: newStatus,
      });

      if (!updatedTour) {
        throw new NotFoundException('Tour not found after update.');
      }

      await this.saveLogInDataBase({
        serviceId: tour._id.toString(),
        move: MOVES.UPDATE,
        user: user,
        registry: tour,
      });

      return updatedTour;
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong changing tour status.',
        error,
      );
    }
  }

  private validateNewTourStatus(
    newStatus: string,
    { status }: TourDocument,
  ): boolean | Error {
    const throwError = (message: string) => {
      throw new BadRequestException(message);
    };

    if (status === newStatus) {
      throwError(`Tour is already in ${newStatus} status.`);
    }

    switch (newStatus) {
      case TourStatus.ACTIVE:
        if (status !== TourStatus.INACTIVE) {
          throwError('The tour must be in inactive status to be activated.');
        }
        break;
      case TourStatus.PUBLISH:
        if (status !== TourStatus.ACTIVE && status !== TourStatus.FINISH) {
          throwError(
            'The tour must be in active or finish status to be published.',
          );
        }
        break;
      case TourStatus.CLOSE:
        if (status !== TourStatus.PUBLISH) {
          throwError('The tour must be in publish status to be closed.');
        }
        break;
      case TourStatus.FINISH:
        if (status !== TourStatus.PUBLISH && status !== TourStatus.CLOSE) {
          throwError(
            'The tour must be in publish or close status to be finished.',
          );
        }
        break;
      case TourStatus.INACTIVE:
        if (status !== TourStatus.ACTIVE) {
          throwError('The tour must be in active status to be inactivated.');
        }
        break;
      default:
        throwError('Invalid new status.');
    }

    return true;
  }

  private async getPOJOTourById(id: string): Promise<TourLean> {
    try {
      const tourPOJO = await this.tourModel.findById(id).lean();
      if (!tourPOJO) throw new NotFoundException('Tour not found.');
      return tourPOJO;
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong getting POJO tour by id.',
        error,
      );
    }
  }

  async validateSaledTour(id: string): Promise<TourLean> {
    try {
      const tour = await this.getPOJOTourById(id);
      if (tour.status !== TourStatus.PUBLISH)
        throw new BadRequestException(
          'The tour must be in publish status to be saled.',
        );
      if (tour.availableSeat === 0)
        throw new BadRequestException('There are not enough seats available.');
      return tour;
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong validating saled tour.',
        error,
      );
    }
  }

  async updateTourSeats(
    tour: TourLean,
    soldSeats: number,
    user: User,
    saleMove: SalesMove,
  ): Promise<void> {
    try {
      const { availableSeat = 0, ocuppiedSeat = 0, seating, _id } = tour;

      let newAvailableSeat: number;
      let newOcuppiedSeat: number;

      if (
        saleMove === SalesMove.SALE &&
        availableSeat > 0 &&
        ocuppiedSeat > 0
      ) {
        newAvailableSeat = Math.max(availableSeat - soldSeats, 0);
        newOcuppiedSeat = Math.min(ocuppiedSeat + soldSeats, seating);

        if (newAvailableSeat <= 0 && newOcuppiedSeat > seating) {
          throw new BadRequestException(
            'There are not enough seats available for sale.',
          );
        }
      } else {
        newAvailableSeat = Math.min(availableSeat + soldSeats, seating);
        newOcuppiedSeat = Math.max(ocuppiedSeat - soldSeats, 0);

        if (newAvailableSeat > seating) {
          throw new BadRequestException('Not enough available seats.');
        }
      }

      const updatedTour = await this.tourModel.findByIdAndUpdate(
        _id,
        { availableSeat: newAvailableSeat, ocuppiedSeat: newOcuppiedSeat },
        { new: true },
      );

      await this.saveLogInDataBase({
        serviceId: _id.toString(),
        move: MOVES.UPDATE,
        user: user.email,
        registry: updatedTour,
      });
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong updating seats.',
        error,
      );
    }
  }

  async getTourCatalog({ id, catalogName }: GetTourCatalogDTO): Promise<any> {
    try {
      const query = createQueryForCatalog(catalogName);

      const tour = await this.tourModel.findById(id).populate(query).exec();

      if (!tour) {
        throw new BadRequestException('Tour not found.');
      }

      const catalogData = tour[catalogName];

      if (!catalogData?.length) {
        throw new NotFoundException(
          `Tour has no ${catalogName} registered yet.`,
        );
      }

      return catalogData;
    } catch (error) {
      throw handleErrorsOnServices('Error finding tour catalog.', error);
    }
  }

  async deleteTour({ id }: UrlValidator, user: string): Promise<void> {
    try {
      const tour = await this.tourModel.findById(id);
      if (!tour) throw new NotFoundException('Tour not found.');
      if (tour.status !== TourStatus.ACTIVE)
        throw new BadRequestException('Tour must be active to be deleted.');
      await this.tourModel.findByIdAndUpdate(id, {
        status: TourStatus.INACTIVE,
      });
      await this.saveLogInDataBase({
        serviceId: tour._id.toString(),
        move: MOVES.DELETE,
        user: user,
        registry: tour,
      });
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong deleting tour.',
        error,
      );
    }
  }

  async searchTours(
    body: SearcherTourDTO,
    { page, limit }: PaginationDTO,
  ): Promise<PaginateResult<TourLean> | Array<TourLean>> {
    try {
      const pipelines = pipelinesMaker(body, { page, limit });
      const result = await this.tourModel.aggregate(pipelines);
      const { docs, totalDocs } = result[0];
      if (docs.length === 0)
        throw new NotFoundException(
          `Tours not found with ${JSON.stringify(body)}`,
        );
      return createPaginatedObject<TourLean>(docs, totalDocs, page, limit);
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong while searching tours.',
        error,
      );
    }
  }

  async insertToursBunch(jsonObject: TourExcel[]) {
    try {
      const tours = await this.mapToDto(jsonObject);
      await this.tourModel.insertMany(tours);
    } catch (error) {
      throw handleErrorsOnServices('Error inserting tours bunch.', error);
    }
  }

  private async mapToDto(excelTours: TourExcel[]): Promise<CreateTourDTO[]> {
    try {
      const mappedDTO: CreateTourDTO[] = [];
      for (const tour of excelTours) {
        const {
          destino,
          transporte,
          tipo,
          horaDeAbordaje,
          horaDeRegreso,
          portada,
          dias,
          noches,
          boxLunch,
          lugares,
          lugaresLibres,
          lugaresOcupados,
          fechaInicio,
          fechaRegreso,
          recomendaciones,
          codigo,
          estatus,
          precio,
        } = tour;
        const destination = await this.destinationService.validateFromTourExcel(
          destino.trim(),
        );
        const transport = await this.transportService.validateFromTourExcel(
          transporte?.trim(),
        );
        const tourType = await this.tourTypeService.validateFromTourExcel(
          tipo.trim(),
        );
        const prices = await this.priceService.validateFromTourExcel(
          precio.trim(),
        );
        const tourDto = {
          destination,
          transport,
          tourType,
          aboardHour: this.mapAboardHourAndReturnHour(horaDeAbordaje),
          returnHour: this.mapAboardHourAndReturnHour(horaDeRegreso),
          front: portada ?? '',
          days: dias ?? 1,
          nights: noches ?? 0,
          boxLunch: (boxLunch ?? BoxLunch.NO) as BoxLunch,
          seating: lugares ?? 0,
          availableSeat: lugaresLibres ?? 0,
          ocuppiedSeat: lugaresOcupados ?? 0,
          initDate: new Date(fechaInicio ?? ''),
          returnDate: new Date(fechaRegreso ?? ''),
          recommendations: recomendaciones ?? '',
          code: codigo ?? '',
          status: estatus ?? TourStatus.INACTIVE,
          prices,
        };
        mappedDTO.push(tourDto);
      }
      return mappedDTO;
    } catch (error) {
      throw handleErrorsOnServices('Error mapping tours to DTO.', error);
    }
  }

  private mapAboardHourAndReturnHour(aboardTime: string): AboardHourDTO[] {
    try {
      const times = aboardTime.split('|');
      return times.map((time) => {
        const [hour, aboardPoint] = time.split(',');
        return new AboardHourDTO(hour ?? '', aboardPoint ?? '');
      });
    } catch (error) {
      throw handleErrorsOnServices(
        'Error mapping aboard hour and return hour.',
        error,
      );
    }
  }

  /* async updateTourCatalog(
    { id }: UrlValidator,
    { catalogName }: UpdateTourCatalogDTO,
    user: string,
  ): Promise<TourLean> {
    try {
      const updatedTour = await this.tourModel.findByIdAndUpdate(
        id,
        { [catalogName]: values },
        { new: true },
      );

      if (!updatedTour) {
        throw new NotFoundException('Tour not found.');
      }

      await this.saveLogInDataBase({
        serviceId: updatedTour._id.toString(),
        move: MOVES.UPDATE,
        user,
        registry: updatedTour,
      });

      return updatedTour;
    } catch (error) {
      throw handleErrorsOnServices(
        `Something went wrong updating tour catalog ${catalogName}.`,
        error,
      );
    }
  } */
}
