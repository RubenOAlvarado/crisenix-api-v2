import { QueryDTO } from '@/shared/models/dtos/searcher/query.dto';
import { Status } from '@/shared/enums/status.enum';
import { DestinationLean } from '@/shared/types/destination/destination.type';
import { PaginateResult } from '@/shared/interfaces/paginate.interface';
import { CreateDestinationDTO } from '@/shared/models/dtos/request/destination/createdestination.dto';
import { UpdateDestinationDTO } from '@/shared/models/dtos/request/destination/updatedestination.dto';
import {
  DestinationDocument,
  Destinations,
} from '@/shared/models/schemas/destination.schema';
import { pipelinesMaker } from '@/shared/utilities/destination-query-maker.helper';
import {
  applyPopulateOptions,
  createPaginatedObject,
  handleErrorsOnServices,
} from '@/shared/utilities/helpers';
import { PhotoValidator } from '@/shared/models/dtos/validators/photo.validator';
import { IdValidator } from '@/shared/models/dtos/validators/id.validator';
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PopulateOptions } from 'mongoose';
import { filterOutPhotos } from './destinations.helper';
import { StatusDTO } from '@/shared/models/dtos/searcher/statusparam.dto';
import { FetchOptionsDto } from '@/shared/models/dtos/searcher/fetchOptions.dto';
import { SearcherDestinationDto } from '@/shared/models/dtos/searcher/destination/searcherDestination.dto';
import { CustomQueryOptions } from '@/shared/interfaces/queryOptions.interface';

@Injectable()
export class DestinationService {
  constructor(
    @InjectModel(Destinations.name)
    private readonly destinationModel: Model<Destinations>,
  ) {}

  private readonly logger = new Logger(DestinationService.name);

  private readonly defaultExcludedFields = { __v: 0, createdAt: 0 };

  private readonly defaultPopulateOptions: PopulateOptions[] = [
    {
      path: 'categories',
      select: this.defaultExcludedFields,
    },
  ];

  private async buildQuery({
    page,
    limit,
    shouldPopulate = false,
    filter = {},
    sort = { createdAt: -1 },
  }: CustomQueryOptions): Promise<DestinationLean[]> {
    let query = this.destinationModel
      .find(filter)
      .select(this.defaultExcludedFields)
      .sort(sort);

    if (page && limit) {
      query = query.limit(limit).skip((page - 1) * limit);
    }

    if (shouldPopulate) {
      query = applyPopulateOptions<DestinationDocument>(
        query,
        this.defaultPopulateOptions,
      );
    }

    return await query.lean();
  }

  async getValidatedDestination(id: string, status: Status = Status.ACTIVE) {
    const destination = await this.destinationModel.findById(id);
    if (!destination) throw new NotFoundException('Destination not found.');
    if (status === Status.INACTIVE && destination.status !== Status.ACTIVE)
      throw new BadRequestException('Destination must be in active status.');
    if (status === Status.ACTIVE && destination.status !== Status.INACTIVE)
      throw new BadRequestException('Destination must be in inactive status.');
    return destination;
  }

  async create(
    createDestinationDTO: CreateDestinationDTO,
  ): Promise<DestinationLean> {
    try {
      const destination = await new this.destinationModel(
        createDestinationDTO,
      ).save();
      return destination.toObject();
    } catch (error: any) {
      throw handleErrorsOnServices(
        'Something went wrong while creating destination.',
        error,
      );
    }
  }

  async findAll({
    page,
    limit,
    status,
    shouldPopulate,
  }: QueryDTO): Promise<PaginateResult<Destinations>> {
    try {
      const filter = status ? { status } : {};
      const docs = await this.buildQuery({
        page,
        limit,
        filter,
        shouldPopulate,
      });
      if (!docs.length) throw new NotFoundException('Destinations not found.');
      const totalDocs = await this.destinationModel.countDocuments(filter);
      return createPaginatedObject<Destinations>(docs, totalDocs, page, limit);
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong while finding destinations.',
        error,
      );
    }
  }

  async findOne(
    { id }: IdValidator,
    { shouldPopulate }: FetchOptionsDto,
  ): Promise<DestinationLean> {
    try {
      const destination = await this.buildQuery({
        filter: { _id: id },
        shouldPopulate,
      });
      if (!destination[0])
        throw new NotFoundException('Destination not found.');
      return destination[0];
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong while finding destination.',
        error,
      );
    }
  }

  async update(
    { id }: IdValidator,
    updateDestinationDTO: UpdateDestinationDTO,
  ): Promise<DestinationLean> {
    try {
      const destination = await this.destinationModel
        .findByIdAndUpdate(id, updateDestinationDTO, { new: true })
        .select({ __v: 0, createdAt: 0 })
        .lean();

      if (!destination) throw new NotFoundException('Destination not found.');
      return destination;
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong while updating destination.',
        error,
      );
    }
  }

  async changeStatus(
    { id }: IdValidator,
    { status }: StatusDTO,
  ): Promise<void> {
    try {
      const destinationToUpdate = await this.getValidatedDestination(
        id,
        status,
      );
      destinationToUpdate.status =
        status === Status.ACTIVE ? Status.INACTIVE : Status.ACTIVE;
      await destinationToUpdate.save();
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong while deleting destination.',
        error,
      );
    }
  }

  async search(
    query: SearcherDestinationDto,
  ): Promise<PaginateResult<DestinationLean> | Array<DestinationLean>> {
    try {
      this.logger.debug(
        `Searching destination with: ${JSON.stringify({ query })}`,
      );
      const pipelines = pipelinesMaker(query);
      const result = await this.destinationModel.aggregate(pipelines);
      const { docs, totalDocs } = result[0];
      if (!docs.length)
        throw new NotFoundException(
          `Destinations not found with: ${query.word} on field: ${query.field} .`,
        );
      return createPaginatedObject<DestinationLean>(
        docs,
        totalDocs,
        query.page,
        query.limit,
      );
    } catch (e) {
      throw handleErrorsOnServices(
        'Something went wrong while looking destination.',
        e,
      );
    }
  }

  async deletePhotos(
    { id }: IdValidator,
    { photos: photosToDelete }: PhotoValidator,
  ): Promise<void> {
    try {
      const destinationToUpdate = await this.getValidatedDestination(id);
      destinationToUpdate.photos = filterOutPhotos(
        destinationToUpdate?.photos,
        photosToDelete,
      );
      await destinationToUpdate.save();
    } catch (error) {
      throw handleErrorsOnServices('Error deleting destination photos.', error);
    }
  }

  async insertBunch(destinations: CreateDestinationDTO[]): Promise<void> {
    try {
      await this.destinationModel.insertMany(destinations);
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong while inserting destinations.',
        error,
      );
    }
  }
}
