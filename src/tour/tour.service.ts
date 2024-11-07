import { DestinationService } from '@/destination/destination.service';
import { TourStatus } from '@/shared/enums/tour/status.enum';
import { CatalogQueryFactory } from '@/shared/factories/catalogQuery.factory';
import { PaginateResult } from '@/shared/interfaces/paginate.interface';
import { TourLean } from '@/shared/types/tour/tour.lean.type';
import { CreateTourDTO } from '@/shared/models/dtos/request/tour/createtour.dto';
import { GetTourCatalogDTO } from '@/shared/models/dtos/request/tour/getTourCatalog.dto';
import { UpdateTourDTO } from '@/shared/models/dtos/request/tour/updatetour.dto';
import { UpdateTourCatalogDTO } from '@/shared/models/dtos/request/tour/updateTourCatalog.dto';
import { Tours, TourDocument } from '@/shared/models/schemas/tour.schema';
import {
  applyPopulateOptions,
  createPaginatedObject,
  handleErrorsOnServices,
} from '@/shared/utilities/helpers';
import { pipelinesMaker } from '@/shared/utilities/tour-query-maker.helper';
import { DestinationValidator } from '@/shared/models/dtos/validators/destination.validator';
import { IdValidator } from '@/shared/models/dtos/validators/id.validator';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PopulateOptions } from 'mongoose';
import { SearcherTourDTO } from '@/shared/models/dtos/searcher/tour/searcherTour.dto';
import { ChangeTourStatusDTO } from '@/shared/models/dtos/searcher/tour/changeStatus.dto';
import { CustomQueryOptions } from '@/shared/interfaces/queryOptions.interface';
import { TourQueryDTO } from '@/shared/models/dtos/searcher/tour/tourQuery.dto';
import { FetchOptionsDto } from '@/shared/models/dtos/searcher/fetchOptions.dto';

@Injectable()
export class TourService {
  constructor(
    @InjectModel(Tours.name) private readonly tourModel: Model<Tours>,
    private readonly destinationService: DestinationService,
  ) {}

  private readonly defaultExcludedFields = { __v: 0, createdAt: 0 };

  private readonly defaultPopulateOptions: PopulateOptions[] = [
    {
      path: 'destination',
      model: 'Destinations',
      populate: [
        {
          path: 'categories',
          model: 'Categories',
          select: this.defaultExcludedFields,
        },
      ],
      select: this.defaultExcludedFields,
    },
    {
      path: 'aboardHours.aboardPoint',
      model: 'AboardPoints',
      select: this.defaultExcludedFields,
    },
    {
      path: 'returnHours.aboardPoint',
      model: 'AboardPoints',
      select: this.defaultExcludedFields,
    },
    {
      path: 'transport',
      model: 'Transports',
      populate: [
        {
          path: 'TransportType',
          model: 'TransportTypes',
          select: this.defaultExcludedFields,
        },
      ],
      select: this.defaultExcludedFields,
    },
    {
      path: 'tourType',
      model: 'TourTypes',
      select: this.defaultExcludedFields,
    },
    {
      path: 'includedServices',
      model: 'IncludedServices',
      select: this.defaultExcludedFields,
    },
    {
      path: 'itinerary',
      model: 'ItineraryActivities',
      select: this.defaultExcludedFields,
    },
  ];

  private async queryBuilder({
    page,
    limit,
    shouldPopulate = false,
    filter = {},
    sort = { createdAt: 1 },
  }: CustomQueryOptions): Promise<TourLean[]> {
    let query = this.tourModel
      .find(filter)
      .select(this.defaultExcludedFields)
      .sort(sort);

    if (page && limit) {
      query = query.limit(limit).skip((page - 1) * limit);
    }

    if (shouldPopulate) {
      query = applyPopulateOptions<TourDocument>(
        query,
        this.defaultPopulateOptions,
      );
    }

    return await query.lean();
  }

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
    shouldPopulate = false,
  }: TourQueryDTO): Promise<PaginateResult<Tours>> {
    try {
      const filter = status ? { status } : {};
      const docs = await this.queryBuilder({
        page,
        limit,
        shouldPopulate,
        filter,
      });
      if (docs.length === 0)
        throw new NotFoundException('No tours registered.');
      const totalDocs = await this.tourModel.countDocuments(filter).exec();

      return createPaginatedObject<Tours>(docs, totalDocs, page, limit);
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong getting all tours.',
        error,
      );
    }
  }

  async findOne(
    { id }: IdValidator,
    { shouldPopulate }: FetchOptionsDto,
  ): Promise<TourLean> {
    try {
      const tours = await this.queryBuilder({
        filter: { _id: id },
        shouldPopulate,
      });

      if (!tours[0]) throw new NotFoundException('Tour not found.');
      return tours[0];
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
      const validDestination =
        await this.destinationService.getValidatedDestination(destination);
      if (validDestination) {
        const filter = { destination };
        const sort = { createdAt: -1 };
        const tour = await this.queryBuilder({ filter, sort });

        if (!tour[0]) throw new NotFoundException('No tour registered.');
        return tour[0];
      }
      return {} as TourLean;
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong getting last registered tour.',
        error,
      );
    }
  }

  async updateTour({ id }: IdValidator, updateTourDTO: UpdateTourDTO) {
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

  async changeTourStatus(
    { id }: IdValidator,
    { newStatus }: ChangeTourStatusDTO,
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

  async getTourCatalog(
    { id }: IdValidator,
    { catalogName }: GetTourCatalogDTO,
  ): Promise<any> {
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

  async deleteTour({ id }: IdValidator): Promise<void> {
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
    query: SearcherTourDTO,
  ): Promise<PaginateResult<TourLean> | Array<TourLean>> {
    try {
      const pipelines = pipelinesMaker(query);
      const result = await this.tourModel.aggregate(pipelines);
      const { docs, totalDocs } = result[0];
      if (docs.length === 0)
        throw new NotFoundException(
          `Tours not found with ${JSON.stringify(query)}`,
        );
      return createPaginatedObject<TourLean>(
        docs,
        totalDocs,
        query.page,
        query.limit,
      );
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong while searching tours.',
        error,
      );
    }
  }

  async updateTourCatalog(
    { id }: IdValidator,
    { catalogName, data }: UpdateTourCatalogDTO,
  ): Promise<any> {
    try {
      const isIdValidator =
        catalogName === 'prices' || catalogName === 'itinerary';

      const transformedData = isIdValidator
        ? data.map(({ id }: IdValidator) => id)
        : data;
      const updateQuery = { $set: { [catalogName]: transformedData } };
      const tour = await this.tourModel
        .findByIdAndUpdate(id, updateQuery, { new: true })
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
      if (tour && seats > (tour?.availableSeats ?? 0))
        throw new BadRequestException('Not enough seats available.');
      const updatedTour = await this.tourModel.findByIdAndUpdate(
        tour._id,
        {
          availableSeat: (tour?.availableSeats ?? 0) - seats,
          ocuppiedSeat: tour?.ocuppiedSeats + seats,
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
      if (tour && seats > tour?.ocuppiedSeats)
        throw new BadRequestException('Not enough seats reserved.');
      const updatedTour = await this.tourModel.findByIdAndUpdate(
        tour._id,
        {
          availableSeat: (tour?.availableSeats ?? 0) + seats,
          ocuppiedSeat: tour?.ocuppiedSeats - seats,
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
