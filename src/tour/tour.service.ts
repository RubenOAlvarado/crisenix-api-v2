import { EventlogService } from '@/eventlog/eventlog.service';
import { QueryDTO } from '@/shared/dtos/query.dto';
import { MOVES } from '@/shared/enums/moves.enum';
import { UserRoles } from '@/shared/enums/roles';
import { TourStatus } from '@/shared/enums/tour/status.enum';
import { PaginateResult } from '@/shared/interfaces/paginate.interface';
import { CreateEventLogDTO } from '@/shared/models/dtos/eventlog/eventlog.dto';
import { CreateTourDTO } from '@/shared/models/dtos/tour/createtour.dto';
import { TourByIncluded } from '@/shared/models/dtos/tour/tourbyincluded.dto';
import { UpdateTourDTO } from '@/shared/models/dtos/tour/updatetour.dto';
import { Tours, TourDocument } from '@/shared/models/schemas/tour.schema';
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
    private eventLogService: EventlogService, //@Inject(forwardRef(() => SalesService)) // private salesService: SalesService, // private filerService: FilerService,
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
      this.logger.debug('Creating tour');
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
  }: QueryDTO): Promise<PaginateResult<Tours>> {
    try {
      const docs = status
        ? await this.tourModel
            .find({ status })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .select({ __v: 0, createdAt: 0 })
            .exec()
        : await this.tourModel
            .find()
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .select({ __v: 0, createdAt: 0 })
            .exec();
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

  async findOne({ id }: UrlValidator): Promise<TourDocument> {
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
        .exec();

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

  async getLastRegisteredTour({ id }: UrlValidator): Promise<TourDocument> {
    try {
      this.logger.debug(
        `getting last registered tour for destination with id: ${id}`,
      );
      const tour = await this.tourModel
        .findOne({ destination: id })
        .sort({ createdAt: -1 })
        .select({ __v: 0, createdAt: 0 })
        .limit(1)
        .exec();

      if (!tour) throw new NotFoundException('No tour registered.');
      return tour;
    } catch (error) {
      this.logger.error(`error getting last registered tour: ${error}`);
      if (error instanceof NotFoundException) throw error;
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
    tour: TourDocument,
  ): boolean {
    if (tour.status === newStatus)
      throw new BadRequestException('Tour is already in wanted status.');
    if (newStatus === TourStatus.INACTIVE && tour.status !== TourStatus.ACTIVE)
      throw new BadRequestException(
        'The tour must be in in active status to be inactivated.',
      );
    if (newStatus === TourStatus.ACTIVE && tour.status !== TourStatus.INACTIVE)
      throw new BadRequestException(
        'The tour must be in in inactive status to be activated.',
      );
    if (
      newStatus === TourStatus.PUBLISH &&
      tour.status !== TourStatus.ACTIVE &&
      tour.status !== TourStatus.FINISH
    )
      throw new BadRequestException(
        'The tour must be in active or finish status to be published.',
      );
    if (newStatus === TourStatus.CLOSE && tour.status !== TourStatus.PUBLISH)
      throw new BadRequestException(
        'The tour must be in publish status to be closed.',
      );
    if (
      newStatus === TourStatus.FINISH &&
      tour.status !== TourStatus.PUBLISH &&
      tour.status !== TourStatus.CLOSE
    )
      throw new BadRequestException(
        'The tour must be in publish or close status to be finished.',
      );
    return true;
  }

  async getWebTourById({ id }: UrlValidator): Promise<TourDocument> {
    try {
      this.logger.debug(`getting web tour with id: ${id}`);
      const tour = await this.tourModel
        .findById(id)
        .populate('destination')
        .select({ __v: 0, createdAt: 0 })
        .exec();

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

  async getToursByIncluded(
    { page, limit }: QueryDTO,
    { included }: TourByIncluded,
  ): Promise<void> {
    try {
      this.logger.debug(`getting tours by included: ${included}`);
      const skip = (page - 1) * limit;
      const aggregateLimit = limit * 1;
      const aggregate = this.tourModel.aggregate([
        {
          $unwind: {
            path: '$included',
            preserveNullAndEmptyArrays: true,
          },
        },
        { $match: { 'included.concept': included } },
        { $skip: skip },
        { $limit: aggregateLimit },
        { $count: 'totalDocs' },
        { $sort: { initDate: 1 } },
      ]);
      const docs = await aggregate.exec();
      this.logger.debug(`result: ${docs}`);
      this.logger.debug(`aggregate object: ${JSON.stringify(aggregate)}`);
      if (docs.length === 0)
        throw new NotFoundException('No tours found for this included.');
    } catch (error) {
      this.logger.error(`Error getting tours by included: ${error}`);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        `Something went wrong looking tours by included.`,
      );
    }
  }
}
