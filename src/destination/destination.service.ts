import { CategoryService } from '@/category/category.service';
import { OriginCityService } from '@/origincity/origincity.service';
import { QueryDTO } from '@/shared/models/dtos/searcher/query.dto';
import { Status } from '@/shared/enums/status.enum';
import { Visa } from '@/shared/enums/visa.enum';
import { DestinationLean } from '@/shared/types/destination/destination.type';
import { DestinationsExcel } from '@/shared/interfaces/excel/destinations.excel.interface';
import { OriginCityLean } from '@/shared/types/origincity/originCity.lean.type';
import { PaginateResult } from '@/shared/interfaces/paginate.interface';
import { CreateDestinationDTO } from '@/shared/models/dtos/request/destination/createdestination.dto';
import { UpdateDestinationDTO } from '@/shared/models/dtos/request/destination/updatedestination.dto';
import {
  DestinationDocument,
  Destinations,
} from '@/shared/models/schemas/destination.schema';
import { pipelinesMaker } from '@/shared/utilities/destination-query-maker.helper';
import {
  createPaginatedObject,
  handleErrorsOnServices,
} from '@/shared/utilities/helpers';
import { PhotoValidator } from '@/shared/models/dtos/validators/photo.validator';
import { IdValidator } from '@/shared/models/dtos/validators/id.validator';
import { TransfertypeService } from '@/transfertype/transfertype.service';
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Query } from 'mongoose';
import { filterOutPhotos } from './destinations.helper';
import { StatusDTO } from '@/shared/models/dtos/searcher/statusparam.dto';
import { FetchOptionsDto } from '@/shared/models/dtos/searcher/fetchOptions.dto';
import { SearcherDestinationDto } from '@/shared/models/dtos/searcher/destination/searcherDestination.dto';
import { PopulateConfig } from '@/shared/types/populateConfig.types';
import { CustomQueryOptions } from '@/shared/interfaces/queryOptions.interface';

@Injectable()
export class DestinationService {
  constructor(
    @InjectModel(Destinations.name)
    private readonly destinationModel: Model<Destinations>,
    private readonly categoryService: CategoryService,
    private readonly originCityService: OriginCityService,
    private readonly transferTypeService: TransfertypeService,
  ) {}

  private readonly logger = new Logger(DestinationService.name);

  private readonly defaultExcludedFields = { __v: 0, createdAt: 0 };

  private readonly defaultPopulateOptions: PopulateConfig[] = [
    {
      path: 'originCities',
      populate: {
        path: 'aboardPoints',
      },
      select: this.defaultExcludedFields,
    },
    {
      path: 'categories',
      select: this.defaultExcludedFields,
    },
    {
      path: 'transferTypes',
      select: this.defaultExcludedFields,
    },
  ];

  private async buildQuery({
    page,
    limit,
    shouldPopulate = false,
    filter = {},
  }: CustomQueryOptions & { filter: Record<string, any> }): Promise<
    DestinationLean[]
  > {
    let query = this.destinationModel
      .find(filter)
      .select(this.defaultExcludedFields);

    if (page && limit) {
      query = query.limit(limit).skip((page - 1) * limit);
    }

    if (shouldPopulate) {
      query = this.applyPopulateOptions(query);
    }

    return await query.lean();
  }

  private applyPopulateOptions(
    query: Query<DestinationDocument[], DestinationDocument>,
  ): Query<DestinationDocument[], DestinationDocument> {
    return this.defaultPopulateOptions.reduce(
      (acc, populateOption) => acc.populate(populateOption),
      query,
    );
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

  async findCities({ id }: IdValidator): Promise<OriginCityLean> {
    try {
      const destination = await this.destinationModel
        .findById(id)
        .populate({
          path: 'originCity',
          populate: {
            path: 'aboardPoints',
          },
        })
        .select({ __v: 0, createdAt: 0 })
        .lean();

      if (!destination) {
        throw new NotFoundException('Destination not found.');
      }

      const { originCities } = destination;

      if (!originCities?.length) {
        throw new NotFoundException('Destination cities not found.');
      }

      return originCities as unknown as OriginCityLean;
    } catch (error) {
      throw handleErrorsOnServices('Error finding destination cities.', error);
    }
  }

  async insertDestinationsBunch(
    jsonObject: DestinationsExcel[],
  ): Promise<void> {
    try {
      const mappedDTO = await this.mapToDTOSequentially(jsonObject);
      await this.destinationModel.insertMany(mappedDTO);
    } catch (error) {
      throw handleErrorsOnServices('Error inserting destinations.', error);
    }
  }

  private async mapToDTOSequentially(
    jsonObject: DestinationsExcel[],
  ): Promise<CreateDestinationDTO[]> {
    const mappedDTO: CreateDestinationDTO[] = [];
    for (const destination of jsonObject) {
      const { categorias, ciudadDeOrigen, tipoDeTraslado, ...rest } =
        destination;

      const categories = await this.categoryService.mapFromNameToObjectId(
        categorias?.split(','),
      );

      const originCities = await this.originCityService.mapFromDestinationExcel(
        ciudadDeOrigen?.split(','),
      );

      const transferTypes = await this.transferTypeService.mapTransferTypeNames(
        tipoDeTraslado?.split(','),
      );

      const destinationDTO: CreateDestinationDTO = {
        categories,
        originCities,
        transferTypes,
        passport: rest.pasaporte === 'Si',
        visa: rest.visa as Visa,
        code: rest.codigo,
        name: rest.nombre,
        description: rest.descripcion,
        tentativeDates: rest.fechasProgramadas,
        transfer: rest.traslado,
      };

      mappedDTO.push(destinationDTO);
    }

    return mappedDTO;
  }

  async validateFromTourExcel(code?: string): Promise<string> {
    try {
      if (!code) throw new BadRequestException('Destination code is required.');
      const destination = await this.destinationModel
        .findOne({
          code,
        })
        .lean()
        .exec();

      if (!destination)
        throw new NotFoundException(
          'Destination not found, needs to be registered before insert tours.',
        );

      return destination._id.toString();
    } catch (error) {
      throw handleErrorsOnServices('Error validating destination.', error);
    }
  }
}
