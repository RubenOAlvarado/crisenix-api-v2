import { CategoryService } from '@/category/category.service';
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
import { CreateDestinationDTO } from '@/shared/models/dtos/request/destination/createdestination.dto';
import { UpdateDestinationDTO } from '@/shared/models/dtos/request/destination/updatedestination.dto';
import { Destinations } from '@/shared/models/schemas/destination.schema';
import { pipelinesMaker } from '@/shared/utilities/destination-query-maker.helper';
import {
  createPaginatedObject,
  handleErrorsOnServices,
} from '@/shared/utilities/helpers';
import { DestinationValidator } from '@/shared/validators/destination.validator';
import { PhotoValidator } from '@/shared/validators/photo.validator';
import { UrlValidator } from '@/shared/validators/urlValidator.dto';
import { TransfertypeService } from '@/transfertype/transfertype.service';
import {
  BadRequestException,
  Injectable,
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
    private readonly categoryService: CategoryService,
    private readonly originCityService: OriginCityService,
    private readonly transferTypeService: TransfertypeService,
  ) {}

  private readonly logger = new Logger(DestinationService.name);

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
      const destinationToUpdate = await this.destinationModel.findById(
        destination,
      );

      if (!destinationToUpdate) {
        throw new NotFoundException('Destination not found.');
      }

      if (destinationToUpdate.status !== Status.ACTIVE) {
        throw new BadRequestException('Destination must be in active status.');
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
      throw handleErrorsOnServices('Error deleting destination photos.', error);
    }
  }

  async findCities({ id }: UrlValidator): Promise<OriginCityLean> {
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
        ciudadDeOrigen?.split('|'),
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
      throw handleErrorsOnServices('Error validating destination.', error);
    }
  }

  async validateFromTourExcel(code: string): Promise<string> {
    try {
      if (!code) throw new BadRequestException('Destination code is required.');
      const destination = await this.destinationModel
        .findOne({
          code,
        })
        .lean()
        .exec();

      if (!destination) throw new NotFoundException('Destination not found.');

      return destination._id.toString();
    } catch (error) {
      throw handleErrorsOnServices('Error validating destination.', error);
    }
  }
}
