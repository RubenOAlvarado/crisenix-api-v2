import { DestinationService } from '@/destination/destination.service';
import { EventlogService } from '@/eventlog/eventlog.service';
import { PaginationDTO } from '@/shared/dtos/pagination.dto';
import { MOVES } from '@/shared/enums/moves.enum';
import { UserRoles } from '@/shared/enums/roles';
import { SalesMove } from '@/shared/enums/sales/salemove.enum';
import { SearchType } from '@/shared/enums/searcher/search-type.enum';
import { SearcherTourDTO } from '@/shared/enums/searcher/tour/searcher.dto';
import { TourStatus } from '@/shared/enums/tour/status.enum';
import { PaginateResult } from '@/shared/interfaces/paginate.interface';
import { TourLean } from '@/shared/interfaces/tour/tour.lean.interface';
import { User } from '@/shared/interfaces/user/user.interface';
import { CreateEventLogDTO } from '@/shared/models/dtos/eventlog/eventlog.dto';
import { CreateTourDTO } from '@/shared/models/dtos/tour/createtour.dto';
import { PaginatedTourDTO } from '@/shared/models/dtos/tour/paginatedTour.dto';
import { UpdateTourDTO } from '@/shared/models/dtos/tour/updatetour.dto';
import { Tours, TourDocument } from '@/shared/models/schemas/tour.schema';
import { pipelinesMaker } from '@/shared/utilities/tour-query-maker.helper';
import { DestinationValidator } from '@/shared/validators/destination.validator';
import { UrlValidator } from '@/shared/validators/urlValidator.dto';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class TourService {
  constructor(
    @InjectModel(Tours.name) private readonly tourModel: Model<Tours>,
    private eventLogService: EventlogService,
    private destinationService: DestinationService, // @Inject(forwardRef(() => SalesService)) // private salesService: SalesService, // private filerService: FilerService,
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
      this.logger.error(`Error saving log in database: ${error}`);
      throw error;
    }
  }

  async createTour(
    tour: CreateTourDTO,
    user = UserRoles.ADMIN,
  ): Promise<Tours> {
    try {
      this.logger.debug(`creating tour by user: ${user}`);
      const newTour = new this.tourModel(tour);
      await newTour.save();
      await this.saveLogInDataBase({
        serviceId: newTour._id.toString(),
        move: MOVES.CREATE,
        user: user,
        registry: newTour,
      });
      return newTour;
    } catch (error) {
      this.logger.error(`Error creating tour: ${error}`);
      throw new InternalServerErrorException(
        'Something went wrong while creating tour.',
      );
    }
  }

  async findAll({
    page,
    limit,
    status,
  }: PaginatedTourDTO): Promise<PaginateResult<Tours>> {
    try {
      const docs = status
        ? await this.tourModel
            .find({ status })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .select({ __v: 0, createdAt: 0 })
            .lean()
        : await this.tourModel
            .find()
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .select({ __v: 0, createdAt: 0 })
            .lean();
      if (docs.length === 0)
        throw new NotFoundException('No tours registered.');
      const totalDocs = status
        ? await this.tourModel.countDocuments({ status }).exec()
        : await this.tourModel.countDocuments().exec();

      const paginatedTours: PaginateResult<Tours> = {
        docs,
        totalDocs,
        hasPrevPage: page > 1,
        hasNextPage: page < Math.ceil(totalDocs / limit),
        page,
        totalPages: Math.ceil(totalDocs / limit),
      };

      return paginatedTours;
    } catch (error) {
      this.logger.error(`Error getting all tours: ${error}`);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'Something went wrong while getting tours.',
      );
    }
  }

  async findOne({ id }: UrlValidator): Promise<TourLean> {
    try {
      this.logger.debug(`getting tour with id: ${id}`);
      const tour = await this.tourModel
        .findById(id)
        .populate([
          'destination',
          'transport',
          'tourType',
          'included',
          'itinerary',
          'price',
          'departure',
        ])
        .populate({
          path: 'aboardHour.aboardPoint',
          model: 'AboardPoint',
        })
        .populate({
          path: 'returnHour.aboardPoint',
          model: 'AboardPoint',
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
      this.logger.error(`Error getting tour by id: ${error}`);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        `Something went wrong looking tour by id.`,
      );
    }
  }

  async getLastRegisteredTour({
    destination,
  }: DestinationValidator): Promise<TourLean> {
    try {
      this.logger.debug(
        `getting last registered tour for destination with id: ${destination}`,
      );
      await this.destinationService.validateFromTour({
        destination,
      });
      this.logger.debug(`Destination is valid`);
      const tour = await this.tourModel
        .findOne({ destination })
        .sort({ createdAt: -1 })
        .populate([
          'destination',
          'transport',
          'tourType',
          'included',
          'itinerary',
          'price',
          'departure',
        ])
        .populate({
          path: 'aboardHour.aboardPoint',
          model: 'AboardPoint',
        })
        .populate({
          path: 'returnHour.aboardPoint',
          model: 'AboardPoint',
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
    } catch (error) {
      this.logger.error(`Error getting last registered tour: ${error}`);
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      )
        throw error;
      throw new InternalServerErrorException(
        `Error getting last registered tour: ${error}`,
      );
    }
  }

  async updateTour(
    { id }: UrlValidator,
    updateTourDTO: UpdateTourDTO,
    user: string,
  ) {
    try {
      this.logger.debug(`updating tour with id: ${id}`);
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
      this.logger.error(`error updating tour: ${error}`);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        `Something went wrong while updating tour.`,
      );
    }
  }

  async changeTourStatus(
    { id }: UrlValidator,
    newStatus: string,
    user: string,
  ): Promise<void> {
    try {
      this.logger.debug(`changing tour status to: ${newStatus}`);
      const tour = await this.tourModel.findById(id);

      if (!tour) throw new NotFoundException('Tour not found.');
      if (!this.validateNewTourStatus(newStatus, tour)) return;

      await this.tourModel.findByIdAndUpdate(id, { status: newStatus });
      await this.saveLogInDataBase({
        serviceId: tour._id.toString(),
        move: MOVES.UPDATE,
        user: user,
        registry: tour,
      });
    } catch (error) {
      this.logger.error(`error changing tour status: ${error}`);
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      )
        throw error;
      throw new InternalServerErrorException(
        `Something went wrong while changing tour status.`,
      );
    }
  }

  private validateNewTourStatus(
    newStatus: string,
    { status }: TourDocument,
  ): boolean | Error {
    if (status === newStatus)
      throw new BadRequestException(`Tour is already in ${newStatus} status.`);
    if (newStatus === TourStatus.ACTIVE && status !== TourStatus.INACTIVE)
      throw new BadRequestException(
        'The tour must be in in inactive status to be activated.',
      );
    if (
      newStatus === TourStatus.PUBLISH &&
      status !== TourStatus.ACTIVE &&
      status !== TourStatus.FINISH
    )
      throw new BadRequestException(
        'The tour must be in active or finish status to be published.',
      );
    if (newStatus === TourStatus.CLOSE && status !== TourStatus.PUBLISH)
      throw new BadRequestException(
        'The tour must be in publish status to be closed.',
      );
    if (
      newStatus === TourStatus.FINISH &&
      status !== TourStatus.PUBLISH &&
      status !== TourStatus.CLOSE
    )
      throw new BadRequestException(
        'The tour must be in publish or close status to be finished.',
      );
    return true;
  }

  async getWebTourById({ id }: UrlValidator): Promise<TourLean> {
    try {
      this.logger.debug(`getting web tour with id: ${id}`);
      const tour = await this.tourModel
        .findById(id)
        .populate('destination')
        .select({ __v: 0, createdAt: 0 })
        .lean();

      if (!tour) throw new NotFoundException('Tour not found.');
      return tour;
    } catch (error) {
      this.logger.error(`Error getting web tour by id: ${error}`);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        `Something went wrong looking web tour by id.`,
      );
    }
  }

  private async getPOJOTourById(id: string): Promise<TourLean> {
    try {
      const tourPOJO = await this.tourModel.findById(id).lean();
      if (!tourPOJO) throw new NotFoundException('Tour not found.');
      return tourPOJO;
    } catch (error) {
      this.logger.error(`Error getting POJO tour by id: ${error}`);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        `Something went wrong looking POJO tour by id.`,
      );
    }
  }

  async validateSaledTour(id: string): Promise<TourLean> {
    try {
      this.logger.debug(`validating saled tour with id: ${id}`);
      const tour = await this.getPOJOTourById(id);
      if (tour.status !== TourStatus.PUBLISH)
        throw new BadRequestException(
          'The tour must be in publish status to be saled.',
        );
      if (tour.availableSeat === 0)
        throw new BadRequestException('There are not enough seats available.');
      return tour;
    } catch (error) {
      this.logger.error(`Error validating saled tour: ${error}`);
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(
        `Something went wrong validating saled tour.`,
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
      let newAvailableSeat = availableSeat;
      let newOcuppiedSeat = 0;
      if (
        saleMove === SalesMove.SALE &&
        availableSeat > 0 &&
        ocuppiedSeat > 0
      ) {
        newAvailableSeat = availableSeat - soldSeats;
        newOcuppiedSeat = ocuppiedSeat + soldSeats;

        if (newAvailableSeat <= 0 && newOcuppiedSeat > seating)
          throw new BadRequestException(
            'There are not enough seats available to sale.',
          );
      } else {
        newAvailableSeat = availableSeat + soldSeats;
        newOcuppiedSeat = ocuppiedSeat - soldSeats;

        if (newAvailableSeat > seating)
          throw new BadRequestException('There are not enough seats.');
      }

      const updatedTour = await this.tourModel.findByIdAndUpdate(
        _id,
        { availableSeat: newAvailableSeat, ocuppiedSeat: newOcuppiedSeat },
        { new: true },
      );

      await this.saveLogInDataBase({
        serviceId: tour._id.toString(),
        move: MOVES.UPDATE,
        user: user.email,
        registry: updatedTour,
      });
    } catch (error) {
      this.logger.error(`Error updating seats: ${error}`);
      if (error instanceof BadRequestException) throw error;
      else throw new InternalServerErrorException('Error updating seats');
    }
  }

  async getTourItineraries({ id }: UrlValidator): Promise<any> {
    try {
      const tour = await this.tourModel
        .findById(id)
        .populate('itinerary')
        .exec();
      if (!tour) {
        throw new BadRequestException('Tour not found.');
      }
      if (!tour.itinerary) {
        throw new NotFoundException('Tour has not itineraries registered yet.');
      }
      return tour.itinerary;
    } catch (error) {
      this.logger.error(`Error finding tour itineraries: ${error}`);
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      )
        throw error;
      else throw new InternalServerErrorException('Error updating seats');
    }
  }

  async deleteTour({ id }: UrlValidator, user: string): Promise<void> {
    try {
      this.logger.debug(`deleting tour with id: ${id}`);
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
      this.logger.error(`Error deleting tour: ${error}`);
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      )
        throw error;
      throw new InternalServerErrorException(
        `Something went wrong while deleting tour.`,
      );
    }
  }

  async searchTours(
    body: SearcherTourDTO,
    query: PaginationDTO,
  ): Promise<PaginateResult<TourLean> | Array<TourLean>> {
    try {
      if (body?.searchType !== SearchType.EXACTMATCH) {
        this.logger.debug('Alike searching.');
        this.logger.debug(`searching tours by word: ${body.word}`);
        const pipelines = pipelinesMaker(body, query);
        const tours = await this.tourModel.aggregate(pipelines);
        if (tours.length === 0) throw new NotFoundException('No tours found.');
        return tours;
      }
      this.logger.debug('Exact match searching.');
      this.logger.debug(`Searching tours by: ${JSON.stringify(body)}`);
      const pipelines = pipelinesMaker(body, query);
      const result = await this.tourModel.aggregate(pipelines);
      const { docs, totalDocs } = result[0];
      if (docs.length === 0)
        throw new NotFoundException(
          `Tours not found with ${JSON.stringify(body)}`,
        );
      return {
        docs,
        totalDocs,
        hasPrevPage: query.page > 1,
        hasNextPage: query.page < Math.ceil(totalDocs / query.limit),
        page: query.page,
        totalPages: Math.ceil(totalDocs / query.limit),
      };
    } catch (error) {
      this.logger.error(`Error searching tours: ${error}`);
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      )
        throw error;
      throw new InternalServerErrorException(
        `Something went wrong while searching tours.`,
      );
    }
  }
}
