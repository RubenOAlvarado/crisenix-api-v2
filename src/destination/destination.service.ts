import { CategoryService } from '@/category/category.service';
import { FilerService } from '@/filer/filer.service';
import { OriginCityService } from '@/origincity/origincity.service';
import { PaginationDTO } from '@/shared/dtos/pagination.dto';
import { QueryDTO } from '@/shared/dtos/query.dto';
import { SearcherDTO } from '@/shared/enums/searcher/destination/searcher.dto';
import { Status } from '@/shared/enums/status.enum';
import { Visa } from '@/shared/enums/visa.enum';
import { DestinationLean } from '@/shared/interfaces/destination/destination.interface';
import { DestinationsExcel } from '@/shared/interfaces/excel/destinations.excel.interface';
import { OriginCityLean } from '@/shared/interfaces/origincity/originCity.lean.interface';
import { PaginateResult } from '@/shared/interfaces/paginate.interface';
import { CreateDestinationDTO } from '@/shared/models/dtos/destination/createdestination.dto';
import { UpdateDestinationDTO } from '@/shared/models/dtos/destination/updatedestination.dto';
import { Destinations } from '@/shared/models/schemas/destination.schema';
import { pipelinesMaker } from '@/shared/utilities/destination-query-maker.helper';
import {
  createPaginatedObject,
  handleErrorsOnServices,
} from '@/shared/utilities/helpers';
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
import { Model } from 'mongoose';

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
      const query = status ? { status } : {};
      const docs = await this.destinationModel
        .find(query)
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .populate({
          path: 'originCity',
          populate: {
            path: 'aboardPoints',
          },
        })
        .populate('category')
        .populate('translationType')
        .select({ __v: 0, createdAt: 0 })
        .lean();
      if (!docs.length) throw new NotFoundException('Destinations not found.');
      const totalDocs = await this.destinationModel.countDocuments(query);
      return createPaginatedObject<DestinationLean>(
        docs,
        totalDocs,
        page,
        limit,
      );
    } catch (error) {
      this.logger.error(
        `Something went wrong while finding destinations: ${error}`,
      );
      throw handleErrorsOnServices(
        'Something went wrong while finding destinations.',
        error,
      );
    }
  }

  async findOne({ id }: UrlValidator): Promise<DestinationLean> {
    try {
      const destination = await this.destinationModel
        .findById(id)
        .populate({
          path: 'originCity',
          populate: {
            path: 'aboardPoints',
          },
        })
        .populate('category')
        .populate('translationType')
        .select({ __v: 0, createdAt: 0 })
        .lean();
      if (!destination) throw new NotFoundException('Destination not found.');
      return destination;
    } catch (error) {
      this.logger.error(
        `Something went wrong while finding destination: ${error}`,
      );
      throw handleErrorsOnServices(
        'Something went wrong while finding destination.',
        error,
      );
    }
  }

  async findOneWeb({ id }: UrlValidator): Promise<DestinationLean> {
    try {
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
      throw handleErrorsOnServices(
        'Something went wrong while finding destination.',
        error,
      );
    }
  }

  async update(
    { id }: UrlValidator,
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
      this.logger.error(
        `Something went wrong while updating destination: ${error}`,
      );
      throw handleErrorsOnServices(
        'Something went wrong while updating destination.',
        error,
      );
    }
  }

  async delete({ id }: UrlValidator): Promise<void> {
    try {
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
      throw handleErrorsOnServices(
        'Something went wrong while deleting destination.',
        error,
      );
    }
  }

  async reactivate({ id }: UrlValidator): Promise<void> {
    try {
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
      throw handleErrorsOnServices(
        'Something went wrong while reactivating destination.',
        error,
      );
    }
  }

  async search(
    searcherDTO: SearcherDTO,
    queryParams: PaginationDTO,
  ): Promise<PaginateResult<DestinationLean> | Array<DestinationLean>> {
    try {
      this.logger.debug(
        `searching destination with: ${JSON.stringify(searcherDTO)}`,
      );
      const pipelines = pipelinesMaker(searcherDTO, queryParams);
      const result = await this.destinationModel.aggregate(pipelines);
      const { docs, totalDocs } = result[0];
      if (!docs.length)
        throw new NotFoundException(
          `Destinations not found with: ${searcherDTO.word} on field: ${searcherDTO.field} .`,
        );
      return createPaginatedObject<DestinationLean>(
        docs,
        totalDocs,
        queryParams.page,
        queryParams.limit,
      );
    } catch (e) {
      this.logger.error(
        `Something went wrong looking destination with ${searcherDTO.word} in ${searcherDTO.field}: ${e}`,
      );
      throw handleErrorsOnServices(
        'Something went wrong while looking destination.',
        e,
      );
    }
  }

  async deletePhotos({
    photo: photoToDelete,
    destination,
  }: PhotoValidator): Promise<void> {
    try {
      this.logger.debug(
        `Deleting photo from destination with id: ${destination}`,
      );

      const destinationToUpdate = await this.destinationModel.findById(
        destination,
      );

      if (!destinationToUpdate) {
        throw new NotFoundException('Destination not found.');
      }

      if (destinationToUpdate.status !== Status.ACTIVE) {
        throw new BadRequestException('Destination must be in Active status.');
      }

      const { photos } = destinationToUpdate;

      if (!photos || !photos.includes(photoToDelete)) {
        throw new BadRequestException(
          'Photo does not belong to the requested destination.',
        );
      }

      const updatedPhotos = photos.filter(
        (current) => current !== photoToDelete,
      );

      await this.destinationModel.findByIdAndUpdate(destination, {
        photos: updatedPhotos,
      });

      this.logger.debug('Photo successfully deleted.');
    } catch (error) {
      const errorMessage = `Error deleting destination photos: ${error}`;
      this.logger.error(errorMessage);
      throw handleErrorsOnServices('Error deleting destination photos.', error);
    }
  }

  async findCities({ id }: UrlValidator): Promise<OriginCityLean> {
    try {
      this.logger.debug(`Finding cities from destination with id: ${id}`);

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

      const { originCity } = destination;

      if (!originCity?.length) {
        throw new NotFoundException('Destination cities not found.');
      }

      return originCity as unknown as OriginCityLean;
    } catch (error) {
      this.logger.error(`Error finding destination cities: ${error}`);
      throw handleErrorsOnServices('Error finding destination cities.', error);
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
    const mappedDTO = await Promise.all(
      jsonObject.map(async (destination) => {
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

        const category = await this.categoryService.mapFromNameToObjectId(
          categorias?.split(','),
        );

        const originCity = await this.originCityService.mapFromDestinationExcel(
          ciudadDeOrigen,
        );

        const translationType =
          await this.translationTypeService.mapTranslationTypeNames(
            tipoDeTraslado?.split(','),
          );

        return {
          code: codigo,
          name: nombre,
          description: descripcion,
          category,
          status: estatus as Status,
          originCity,
          scheduledDates: fechasProgramadas,
          passport: pasaporte === 'Si',
          visa: visa as Visa,
          translationType,
          translation: traslado,
        } as CreateDestinationDTO;
      }),
    );

    return mappedDTO;
  }

  async validateFromTour({
    destination,
  }: DestinationValidator): Promise<boolean> {
    try {
      const destinationToValidate = await this.destinationModel.findById(
        destination,
      );

      if (!destinationToValidate)
        throw new NotFoundException('Destination not found.');

      if (destinationToValidate.status !== Status.ACTIVE)
        throw new BadRequestException('Destination must be in Active status.');

      return true;
    } catch (error) {
      this.logger.error(`Error validating destination: ${error}`);
      throw handleErrorsOnServices('Error validating destination.', error);
    }
  }
}
