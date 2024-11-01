import { AboardpointService } from '@/aboardpoint/aboardpoint.service';
import { DestinationService } from '@/destination/destination.service';
import { PricesService } from '@/prices/prices.service';
import { PaginationDTO } from '@/shared/dtos/pagination.dto';
import { ChangeTourStatusDTO } from '@/shared/dtos/searcher/tour/changeStatus.dto';
import { TourStatus } from '@/shared/enums/tour/status.enum';
import { CatalogQueryFactory } from '@/shared/factories/catalogQuery.factory';
import { TourExcel } from '@/shared/interfaces/excel/tour.excel.interface';
import { PaginateResult } from '@/shared/interfaces/paginate.interface';
import { TourLean } from '@/shared/interfaces/tour/tour.lean.interface';
import { AboardHourDTO } from '@/shared/models/dtos/request/tour/aboardhour.dto';
import { CreateTourDTO } from '@/shared/models/dtos/request/tour/createtour.dto';
import { GetTourCatalogDTO } from '@/shared/models/dtos/request/tour/getTourCatalog.dto';
import { UpdateTourDTO } from '@/shared/models/dtos/request/tour/updatetour.dto';
import { UpdateTourCatalogDTO } from '@/shared/models/dtos/request/tour/updateTourCatalog.dto';
import { PaginatedTourDTO } from '@/shared/models/dtos/response/tour/paginatedTour.dto';
import { Tours, TourDocument } from '@/shared/models/schemas/tour.schema';
import {
  createPaginatedObject,
  handleErrorsOnServices,
} from '@/shared/utilities/helpers';
import { pipelinesMaker } from '@/shared/utilities/tour-query-maker.helper';
import { DestinationValidator } from '@/shared/validators/destination.validator';
import { UrlValidator } from '@/shared/validators/urlValidator.dto';
import { TourtypeService } from '@/tourtype/tourtype.service';
import { TransportsService } from '@/transports/transports.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PopulateOptions } from 'mongoose';
import { SearcherTourDTO } from '@/shared/dtos/searcher/tour/searcherTour.dto';

@Injectable()
export class TourService {
  constructor(
    @InjectModel(Tours.name) private readonly tourModel: Model<Tours>,
    private readonly destinationService: DestinationService,
    private readonly transportService: TransportsService,
    private readonly tourTypeService: TourtypeService,
    private readonly priceService: PricesService,
    private readonly aboardPointService: AboardpointService,
  ) {}

  async createTour(tour: CreateTourDTO): Promise<Tours> {
    try {
      const newTour = new this.tourModel(tour);
      await newTour.save();
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
        .populate('destination', { __v: 0, createdAt: 0 })
        .populate('transport', { __v: 0, createdAt: 0 })
        .populate('tourType', { __v: 0, createdAt: 0 })
        .populate({
          path: 'aboardHour.aboardPoint',
          model: 'AboardPoints',
          select: { __v: 0, createdAt: 0 },
        })
        .populate({
          path: 'returnHour.aboardPoint',
          model: 'AboardPoints',
          select: { __v: 0, createdAt: 0 },
        })
        .select({ __v: 0, createdAt: 0 })
        .lean()
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
        .populate('transport', { __v: 0, createdAt: 0 })
        .populate('tourType', { __v: 0, createdAt: 0 })
        .populate('includeds', { __v: 0, createdAt: 0 })
        .populate('itineraries', { __v: 0, createdAt: 0 })
        .populate({
          path: 'destination',
          model: 'Destinations',
          populate: [
            {
              path: 'originCities',
              model: 'OriginCities',
              populate: {
                path: 'aboardPoints',
                model: 'AboardPoints',
                select: { __v: 0, createdAt: 0 },
              },
              select: { __v: 0, createdAt: 0 },
            },
            {
              path: 'categories',
              model: 'Categories',
              select: { __v: 0, createdAt: 0 },
            },
            {
              path: 'transferTypes',
              model: 'TransferTypes',
              select: { __v: 0, createdAt: 0 },
            },
          ],
          select: { __v: 0, createdAt: 0 },
        })
        .populate({
          path: 'aboardHour.aboardPoint',
          model: 'AboardPoints',
          select: { __v: 0, createdAt: 0 },
        })
        .populate({
          path: 'returnHour.aboardPoint',
          model: 'AboardPoints',
          select: { __v: 0, createdAt: 0 },
        })
        .select({ __v: 0, createdAt: 0 })
        .lean()
        .exec();

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
          .populate('transport', { __v: 0, createdAt: 0 })
          .populate('tourType', { __v: 0, createdAt: 0 })
          .populate('includeds', { __v: 0, createdAt: 0 })
          .populate('itineraries', { __v: 0, createdAt: 0 })
          .populate({
            path: 'destination',
            model: 'Destinations',
            select: { __v: 0, createdAt: 0 },
          })
          .populate({
            path: 'aboardHour.aboardPoint',
            model: 'AboardPoints',
            select: { __v: 0, createdAt: 0 },
          })
          .populate({
            path: 'returnHour.aboardPoint',
            model: 'AboardPoints',
            select: { __v: 0, createdAt: 0 },
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

  async updateTour({ id }: UrlValidator, updateTourDTO: UpdateTourDTO) {
    try {
      const updatedTour = await this.tourModel.findByIdAndUpdate(
        id,
        updateTourDTO,
        {
          new: true,
        },
      );
      if (!updatedTour) throw new NotFoundException('Tour not found.');
      return updatedTour;
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong updating tour.',
        error,
      );
    }
  }

  async changeTourStatus({
    id,
    newStatus,
  }: ChangeTourStatusDTO): Promise<TourLean | undefined> {
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

  async getTourCatalog({ id, catalogName }: GetTourCatalogDTO): Promise<any> {
    try {
      const query = CatalogQueryFactory.createQuery(catalogName);

      const tour = await this.tourModel
        .findById(id)
        .populate(query as unknown as PopulateOptions)
        .exec();

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

  async deleteTour({ id }: UrlValidator): Promise<void> {
    try {
      const tour = await this.tourModel.findById(id);
      if (!tour) throw new NotFoundException('Tour not found.');
      if (tour.status !== TourStatus.ACTIVE)
        throw new BadRequestException('Tour must be active to be deleted.');
      await this.tourModel.findByIdAndUpdate(id, {
        status: TourStatus.INACTIVE,
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
          aboardHour: await this.mapAboardHourAndReturnHour(horaDeAbordaje),
          returnHour: await this.mapAboardHourAndReturnHour(horaDeRegreso),
          front: portada ?? '',
          days: dias ?? 1,
          nights: noches ?? 0,
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

  private async mapAboardHourAndReturnHour(
    aboardTime: string,
  ): Promise<AboardHourDTO[]> {
    try {
      const times = aboardTime.split('|');
      const mappedDTO = times.map(async (time) => {
        const [aboardPoint, hour] = time.split(',');
        const mappedAboardPoint = await this.aboardPointService.findByName(
          aboardPoint?.trim(),
        );
        return new AboardHourDTO(
          hour ?? '',
          mappedAboardPoint._id.toString() ?? '',
        );
      });
      return Promise.all(mappedDTO);
    } catch (error) {
      throw handleErrorsOnServices(
        'Error mapping aboard hour and return hour.',
        error,
      );
    }
  }

  async updateTourCatalog({
    tourId,
    catalogName,
    data,
  }: UpdateTourCatalogDTO): Promise<any> {
    try {
      const isUrlValidator =
        catalogName === 'includeds' || catalogName === 'prices';

      const transformedData = isUrlValidator
        ? data.map(({ id }: UrlValidator) => id)
        : data;
      const update = { $set: { [catalogName]: transformedData } };
      const tour = await this.tourModel
        .findByIdAndUpdate(tourId, update, { new: true })
        .populate(catalogName)
        .exec();

      if (!tour) {
        throw new NotFoundException('Tour not found.');
      }

      return tour[catalogName];
    } catch (error) {
      throw handleErrorsOnServices(
        `Something went wrong updating tour catalog ${catalogName}.`,
        error,
      );
    }
  }

  async reserveTourSeats(tourId: string, seats: number): Promise<TourLean> {
    try {
      const tour = await this.tourModel.findById(tourId);
      if (!tour) throw new NotFoundException('Tour not found.');
      if (tour && seats > tour?.availableSeat)
        throw new BadRequestException('Not enough seats available.');
      const updatedTour = await this.tourModel.findByIdAndUpdate(
        tour._id,
        {
          availableSeat: tour?.availableSeat - seats,
          ocuppiedSeat: tour?.ocuppiedSeat + seats,
        },
        { new: true },
      );
      if (!updatedTour)
        throw new NotFoundException('Tour not found after update.');
      return updatedTour;
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong reserving tour seats.',
        error,
      );
    }
  }

  async releaseTourSeats(tourId: string, seats: number): Promise<TourLean> {
    try {
      const tour = await this.tourModel.findById(tourId);
      if (!tour) throw new NotFoundException('Tour not found.');
      if (tour && seats > tour?.ocuppiedSeat)
        throw new BadRequestException('Not enough seats reserved.');
      const updatedTour = await this.tourModel.findByIdAndUpdate(
        tour._id,
        {
          availableSeat: tour?.availableSeat + seats,
          ocuppiedSeat: tour?.ocuppiedSeat - seats,
        },
        { new: true },
      );
      if (!updatedTour)
        throw new NotFoundException('Tour not found after update.');
      return updatedTour;
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong releasing tour seats.',
        error,
      );
    }
  }
}
