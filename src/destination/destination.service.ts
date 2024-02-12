import { CategoryService } from '@/category/category.service';
import { FilerService } from '@/filer/filer.service';
import { OriginCityService } from '@/origincity/origincity.service';
import { PaginationDTO } from '@/shared/dtos/pagination.dto';
import { QueryDTO } from '@/shared/dtos/query.dto';
import { SearchableFields } from '@/shared/enums/searcher/destination/fields.enum';
import { SearcherDTO } from '@/shared/enums/searcher/destination/searcher.dto';
import { SearchType } from '@/shared/enums/searcher/search-type.enum';
import { Status } from '@/shared/enums/status.enum';
import { Visa } from '@/shared/enums/visa.enum';
import { DestinationLean } from '@/shared/interfaces/destination/destination.interface';
import { DestinationsExcel } from '@/shared/interfaces/excel/destinations.excel.interface';
import { OriginCityLean } from '@/shared/interfaces/origincity/originCity.lean.interface';
import { PaginateResult } from '@/shared/interfaces/paginate.interface';
import { CreateDestinationDTO } from '@/shared/models/dtos/destination/createdestination.dto';
import { UpdateDestinationDTO } from '@/shared/models/dtos/destination/updatedestination.dto';
import { Destinations } from '@/shared/models/schemas/destination.schema';
import {
  alikeQueryBuilder,
  generateDefaultSearcherQuery,
  paginationQuery,
  populateSubcatalogsQuery,
  searchByCategoryQuery,
  sortQueryBuilder,
  statusQueryBuilder,
} from '@/shared/utilities/destination-query-maker.helper';
import { DestinationValidator } from '@/shared/validators/destination.validator';
import { PhotoValidator } from '@/shared/validators/photo.validator';
import { UrlValidator } from '@/shared/validators/urlValidator.dto';
import { TranslationtypeService } from '@/translationtype/translationtype.service';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage } from 'mongoose';

@Injectable()
export class DestinationService {
  constructor(
    @InjectModel(Destinations.name)
    private readonly destinationModel: Model<Destinations>,
    private readonly filerService: FilerService,
    private readonly categoryService: CategoryService,
    private readonly translationTypeService: TranslationtypeService,
    private readonly originCityService: OriginCityService,
  ) {}

  private readonly logger = new Logger(DestinationService.name);

  async create(
    createDestinationDTO: CreateDestinationDTO,
  ): Promise<DestinationLean> {
    try {
      this.logger.debug('creating destination');
      const destination = await new this.destinationModel(
        createDestinationDTO,
      ).save();
      return destination.toObject();
    } catch (error) {
      this.logger.error(
        `Something went wrong while creating destination: ${error}`,
      );
      throw new InternalServerErrorException(
        'Something went wrong while creating destination.',
      );
    }
  }

  async findAll({
    page,
    limit,
    status,
  }: QueryDTO): Promise<PaginateResult<DestinationLean>> {
    try {
      this.logger.debug(`finding destinations with status: ${status}`);
      const docs = status
        ? await this.destinationModel
            .find({ status })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .populate('originCity')
            .populate('category')
            .populate('translationType')
            .select({ __v: 0, createdAt: 0 })
            .lean()
        : await this.destinationModel
            .find()
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .populate('originCity')
            .populate('category')
            .populate('translationType')
            .select({ __v: 0, createdAt: 0 })
            .lean();
      if (!docs.length) throw new NotFoundException('Destinations not found.');
      const totalDocs = status
        ? await this.destinationModel.countDocuments({ status })
        : await this.destinationModel.countDocuments();
      return {
        docs,
        totalDocs,
        hasPrevPage: page > 1,
        hasNextPage: page < Math.ceil(totalDocs / limit),
        page,
        totalPages: Math.ceil(totalDocs / limit),
      };
    } catch (error) {
      this.logger.error(
        `Something went wrong while finding destinations: ${error}`,
      );
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'Something went wrong while finding destinations.',
      );
    }
  }

  async findOne({ id }: UrlValidator): Promise<DestinationLean> {
    try {
      this.logger.debug(`finding destination with id: ${id}`);
      const destination = await this.destinationModel
        .findById(id)
        .populate('originCity')
        .populate('category')
        .populate('translationType')
        .populate('aboardPoint')
        .select({ __v: 0, createdAt: 0 })
        .lean();
      if (!destination) throw new NotFoundException('Destination not found.');
      return destination;
    } catch (error) {
      this.logger.error(
        `Something went wrong while finding destination: ${error}`,
      );
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'Something went wrong while finding destination.',
      );
    }
  }

  async findOneWeb({ id }: UrlValidator): Promise<DestinationLean> {
    try {
      this.logger.debug(`finding destination with id: ${id}`);
      const destination = await this.destinationModel
        .findById(id)
        .select({ __v: 0, createdAt: 0 })
        .lean();
      if (!destination) throw new NotFoundException('Destination not found.');
      return destination;
    } catch (error) {
      this.logger.error(
        `Something went wrong while finding destination: ${error}`,
      );
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'Something went wrong while finding destination.',
      );
    }
  }

  async update(
    { id }: UrlValidator,
    updateDestinationDTO: UpdateDestinationDTO,
  ): Promise<DestinationLean> {
    try {
      this.logger.debug(`updating destination with id: ${id}`);
      const destination = await this.destinationModel
        .findByIdAndUpdate(id, updateDestinationDTO, { new: true })
        .select({ __v: 0, createdAt: 0 })
        .lean();

      if (!destination) throw new NotFoundException('Destination not found.');
      return destination;
    } catch (error) {
      this.logger.error(
        `Something went wrong while updating destination: ${error}`,
      );
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'Something went wrong while updating destination.',
      );
    }
  }

  async delete({ id }: UrlValidator): Promise<void> {
    try {
      this.logger.debug(`deleting destination with id: ${id}`);
      const destination = await this.destinationModel.findByIdAndUpdate(
        id,
        { status: Status.INACTIVE },
        { new: true },
      );
      if (!destination) throw new NotFoundException('Destination not found.');
    } catch (error) {
      this.logger.error(
        `Something went wrong while deleting destination: ${error}`,
      );
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'Something went wrong while deleting destination.',
      );
    }
  }

  async reactivate({ id }: UrlValidator): Promise<void> {
    try {
      this.logger.debug(`reactivating destination with id: ${id}`);
      const destination = await this.destinationModel.findByIdAndUpdate(
        id,
        { status: Status.ACTIVE },
        { new: true },
      );
      if (!destination) throw new NotFoundException('Destination not found.');
    } catch (error) {
      this.logger.error(
        `Something went wrong while reactivating destination: ${error}`,
      );
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'Something went wrong while reactivating destination.',
      );
    }
  }

  async search(
    searcherDTO: SearcherDTO,
    queryParams: PaginationDTO,
  ): Promise<PaginateResult<DestinationLean> | Array<DestinationLean>> {
    try {
      if (searcherDTO.searchType === SearchType.EXACTMATCH) {
        const pipelines = this.pipelinesMaker(searcherDTO, queryParams);
        const result = await this.destinationModel.aggregate(pipelines);
        const { docs, totalDocs } = result[0];
        if (!docs.length)
          throw new NotFoundException(
            `Destinations not found with: ${searcherDTO.word} on field: ${searcherDTO.field} .`,
          );
        return {
          docs,
          totalDocs,
          hasPrevPage: queryParams.page > 1,
          hasNextPage:
            queryParams.page < Math.ceil(totalDocs / queryParams.limit),
          page: queryParams.page,
          totalPages: Math.ceil(totalDocs / queryParams.limit),
        };
      } else {
        const pipelines = this.pipelinesMaker(searcherDTO, queryParams);
        const result = await this.destinationModel.aggregate(pipelines);
        if (!result)
          throw new NotFoundException(
            `Destinations not found with: ${searcherDTO.word} on field: ${searcherDTO.field}.`,
          );
        return result;
      }
    } catch (e) {
      this.logger.error(
        `Something went wrong looking destination with ${searcherDTO.word} in ${searcherDTO.field}: ${e}`,
      );
      if (e instanceof NotFoundException) throw e;
      throw new InternalServerErrorException(
        `Something went wrong looking destination with ${searcherDTO.word} in ${searcherDTO.field}`,
      );
    }
  }

  async deletePhotos({
    photo: photoToDelete,
    destination,
  }: PhotoValidator): Promise<void> {
    try {
      this.logger.debug(
        `deleting photo from destination with id: ${destination}`,
      );
      const destinationToUpdate = await this.destinationModel.findById(
        destination,
      );
      if (!destinationToUpdate)
        throw new NotFoundException('Destination not found.');
      if (destinationToUpdate.status !== Status.ACTIVE)
        throw new BadRequestException('Destination must be in Active status.');
      const { photos } = destinationToUpdate;
      if (photos?.some((current) => current === photoToDelete)) {
        delete photos[photos.indexOf(photoToDelete)];
        await this.destinationModel.findByIdAndUpdate(destination, {
          photos,
        });
        this.logger.debug('Photo successfully deleted.');
      } else {
        throw new BadRequestException(
          'Photo does not belong to the requested destination.',
        );
      }
      await this.destinationModel.findByIdAndUpdate(destination, {
        photos,
      });
    } catch (error) {
      this.logger.error(
        `Something went wrong while deleting destination photos: ${error}`,
      );
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      )
        throw error;
      throw new InternalServerErrorException(
        'Something went wrong while deleting destination photos.',
      );
    }
  }

  async findCities({ id }: UrlValidator): Promise<OriginCityLean> {
    try {
      this.logger.debug(`finding cities from destination with id: ${id}`);
      const destination = await this.destinationModel
        .findById(id)
        .populate('originCity')
        .populate({
          path: 'originCity',
          populate: {
            path: 'aboardPoints',
          },
        })
        .select({ __v: 0, createdAt: 0 })
        .lean();
      if (!destination) throw new NotFoundException('Destination not found.');
      const originCity = destination.originCity;
      if (!originCity?.length)
        throw new NotFoundException('Destination cities not found.');
      return originCity as unknown as OriginCityLean;
    } catch (error) {
      this.logger.error(
        `Something went wrong while finding destination cities: ${error}`,
      );
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'Something went wrong while finding destination cities.',
      );
    }
  }

  async loadCatalog(filePath: string): Promise<void> {
    try {
      this.logger.debug('loading destinations from excel file.');
      const jsonObject: DestinationsExcel[] =
        this.filerService.excelToJson(filePath);
      if (!jsonObject.length) throw new BadRequestException('Empty file.');
      const destinations = this.mapToDTO(jsonObject);
      await this.destinationModel.insertMany(destinations);
    } catch (error) {
      this.logger.error(`Something went wrong loading destinations: ${error}`);
      throw new InternalServerErrorException(
        'Something went wrong loading destinations.',
      );
    }
  }

  private async mapToDTO(
    jsonObject: DestinationsExcel[],
  ): Promise<CreateDestinationDTO[]> {
    const mappedDTO = jsonObject.map(async (destination) => {
      const {
        codigo,
        nombre,
        descripcion,
        categorias,
        estatus,
        ciudadDeOrigen,
        fechasProgramadas,
        pasaporte,
        visa,
        tipoDeTraslado,
        traslado,
      } = destination;
      return {
        code: codigo,
        name: nombre,
        description: descripcion,
        category: await this.categoryService.mapFromNameToObjectId(
          categorias?.split(','),
        ),
        status: estatus as Status,
        originCity: await this.originCityService.mapFromDestinationExcel(
          ciudadDeOrigen,
        ),
        scheduledDates: fechasProgramadas,
        passport: pasaporte === 'Si' ? true : false,
        visa: visa as Visa,
        translationType:
          await this.translationTypeService.mapTranslationTypeNames(
            tipoDeTraslado?.split(','),
          ),
        translation: traslado,
      } as unknown as CreateDestinationDTO;
    });
    return await Promise.all(mappedDTO);
  }

  async validateFromTour({
    destination,
  }: DestinationValidator): Promise<boolean> {
    try {
      this.logger.debug(`Validating destination with id: ${destination}`);
      const destinationToValidate = await this.destinationModel.findById(
        destination,
      );
      if (!destinationToValidate)
        throw new NotFoundException('Destination not found.');
      if (destinationToValidate.status !== Status.ACTIVE)
        throw new BadRequestException('Destination must be in Active status.');
      return true;
    } catch (error) {
      this.logger.error(
        `Something went wrong validating destination: ${error}`,
      );
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      )
        throw error;
      throw new InternalServerErrorException(
        'Something went wrong validating destination.',
      );
    }
  }

  private pipelinesMaker(
    { word, field, status, subCatalog, sort, searchType }: SearcherDTO,
    { page, limit }: PaginationDTO,
  ): PipelineStage[] {
    if (searchType === SearchType.EXACTMATCH) {
      this.logger.debug(`Exact match search`);
      this.logger.debug(
        `Making pipelines for search with word: ${word} and field: ${field}`,
      );
      const searcherQuery =
        field !== SearchableFields.CATEGORY
          ? generateDefaultSearcherQuery({ field, word })
          : searchByCategoryQuery(word);
      return [
        statusQueryBuilder(status),
        searcherQuery,
        populateSubcatalogsQuery(subCatalog),
        sortQueryBuilder(sort),
        paginationQuery({ page, limit }),
      ]
        .filter((pipeline) => pipeline !== undefined)
        .flatMap((result) =>
          Array.isArray(result) ? result : [result],
        ) as PipelineStage[];
    }
    this.logger.debug(`Destination alike search`);
    this.logger.debug(`Making pipelines for search with word: ${word}`);
    return [
      statusQueryBuilder(status),
      alikeQueryBuilder(word),
      populateSubcatalogsQuery(subCatalog),
      sortQueryBuilder(sort),
    ]
      .filter((pipeline) => pipeline !== undefined)
      .flatMap((result) =>
        Array.isArray(result) ? result : [result],
      ) as PipelineStage[];
  }
}
