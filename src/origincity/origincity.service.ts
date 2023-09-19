import { OriginCityLean } from '@/shared/interfaces/origincity/originCity.lean.interface';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AboardpointService } from 'src/aboardpoint/aboardpoint.service';
import { FilerService } from 'src/filer/filer.service';
import { QueryDTO } from 'src/shared/dtos/query.dto';
import { SearcherDTO } from 'src/shared/dtos/searcher.dto';
import { Status } from 'src/shared/enums/status.enum';
import { OriginCityExcel } from 'src/shared/interfaces/excel/originCity.excel.interface';
import { PaginateResult } from 'src/shared/interfaces/paginate.interface';
import { CreateOriginCityDTO } from 'src/shared/models/dtos/originCity/createorigincity.dto';
import { UpdateOriginCityDTO } from 'src/shared/models/dtos/originCity/updateorigincity.dto';
import {
  OriginCity,
  OriginCityDocument,
} from 'src/shared/models/schemas/origincity.schema';
import { UrlValidator } from 'src/shared/validators/urlValidator.dto';

@Injectable()
export class OriginCityService {
  constructor(
    @InjectModel(OriginCity.name)
    private readonly originCityModel: Model<OriginCity>,
    private readonly filerService: FilerService,
    private readonly aboardPointService: AboardpointService,
  ) {}

  private readonly logger = new Logger(OriginCityService.name);

  async create(
    createOriginCityDTO: CreateOriginCityDTO,
  ): Promise<OriginCityDocument> {
    try {
      this.logger.debug(`creating new origin city`);
      const createdOriginCity = new this.originCityModel(createOriginCityDTO);
      return createdOriginCity.save();
    } catch (error) {
      this.logger.error(
        `error creating new origin city: ${JSON.stringify(error)}`,
      );
      throw new InternalServerErrorException(`Error creating origin city`);
    }
  }

  async findOne({ id }: UrlValidator): Promise<OriginCityLean> {
    try {
      this.logger.debug(`getting origin city: ${id}`);
      const city = await this.originCityModel
        .findById(id)
        .select({ _id: 0, __v: 0, createdAt: 0 })
        .populate('aboardPoints')
        .lean();
      if (!city) throw new NotFoundException('Origin city not found.');
      return city;
    } catch (error) {
      this.logger.error(`error getting origin city: ${JSON.stringify(error)}`);
      throw new InternalServerErrorException(
        `Error getting origin city: ${error}`,
      );
    }
  }

  async findAll({
    page,
    limit,
    status,
  }: QueryDTO): Promise<PaginateResult<OriginCityLean>> {
    try {
      this.logger.debug(`getting all origin cities`);
      const docs = status
        ? await this.originCityModel
            .find({ status })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .populate('aboardPoints')
            .select({ __v: 0, createdAt: 0 })
            .lean()
        : await this.originCityModel
            .find()
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .populate('aboardPoints')
            .select({ __v: 0, createdAt: 0 })
            .lean();
      if (!docs.length)
        throw new NotFoundException('No origin cities registered.');
      const totalDocs = status
        ? await this.originCityModel.countDocuments({ status }).exec()
        : await this.originCityModel.countDocuments().exec();
      return {
        docs,
        totalDocs,
        hasPrevPage: page > 1,
        hasNextPage: page < Math.ceil(totalDocs / limit),
        page,
        totalPages: Math.ceil(totalDocs / limit),
      };
    } catch (error) {
      this.logger.error(`error getting all origin cities: ${error}`);
      if (error instanceof NotFoundException) throw error;
      else
        throw new InternalServerErrorException(
          `Error getting all origin cities: ${error}`,
        );
    }
  }

  private async validateOriginCity(id: string): Promise<boolean> {
    try {
      this.logger.debug('Validating OriginCity');
      const validOrigin = await this.originCityModel.findById(id).lean();
      if (!validOrigin)
        throw new NotFoundException(`OriginCity ${id} was not found`);
      if (validOrigin.status !== Status.ACTIVE)
        throw new BadRequestException('OriginCity must be in active status');

      return true;
    } catch (e) {
      this.logger.error(`Error validating OriginCity: ${e}`);
      if (e instanceof NotFoundException || e instanceof BadRequestException)
        throw e;
      else
        throw new InternalServerErrorException('Error validating OriginCity');
    }
  }

  async update(
    { id }: UrlValidator,
    updateOriginCity: UpdateOriginCityDTO,
  ): Promise<void> {
    try {
      this.logger.debug('Updating origin city');
      if (await this.validateOriginCity(id))
        await this.originCityModel.findByIdAndUpdate(id, updateOriginCity, {
          new: true,
        });
    } catch (error) {
      this.logger.error(`Error updating origin city: ${error}`);
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      )
        throw error;
      else throw new InternalServerErrorException('Error updating origin city');
    }
  }

  async delete({ id }: UrlValidator): Promise<void> {
    try {
      this.logger.debug('Deleting origin city');
      if (await this.validateOriginCity(id))
        await this.originCityModel.findByIdAndUpdate(
          id,
          { status: Status.INACTIVE },
          { new: true },
        );
    } catch (error) {
      this.logger.error(`Error deleting origin city: ${error}`);
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      )
        throw error;
      else throw new InternalServerErrorException('Error deleting origin city');
    }
  }

  async reactivate({ id }: UrlValidator): Promise<void> {
    try {
      this.logger.debug('Reactivating OriginCity');
      if (await this.validateOriginCity(id))
        await this.originCityModel.findByIdAndUpdate(
          id,
          { status: Status.ACTIVE },
          { new: true },
        );
    } catch (error) {
      this.logger.error(`Error reactivating origincity: ${error}`);
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      )
        throw error;
      else
        throw new InternalServerErrorException('Error reactivating OriginCity');
    }
  }

  async searcher({
    word,
    status,
  }: SearcherDTO): Promise<Array<OriginCityLean>> {
    try {
      this.logger.debug(`Searching origin cities: ${word}`);
      const searchResult = this.originCityModel
        .find({
          $or: [
            { name: { $regex: word, $options: 'i' } },
            { country: { $regex: word, $options: 'i' } },
          ],
          status,
        })
        .populate('aboardPoints')
        .select({ __v: 0, createdAt: 0 })
        .lean();
      if (!searchResult)
        throw new NotFoundException('Any origin city match your search.');
      return searchResult;
    } catch (error) {
      this.logger.error(`Error searching origin cities: ${error}`);
      if (error instanceof NotFoundException) throw error;
      else
        throw new InternalServerErrorException(
          `Error searching origin cities: ${error}`,
        );
    }
  }

  async addAboardPoints(
    { id }: UrlValidator,
    { aboardPoints }: UpdateOriginCityDTO,
  ): Promise<void> {
    try {
      this.logger.debug(`Adding aboard points to origin city: ${id}`);
      if (await this.validateOriginCity(id))
        await this.originCityModel.findByIdAndUpdate(
          id,
          { $push: { aboardPoints } },
          { new: true },
        );
    } catch (error) {
      this.logger.error(`Error adding aboard points to origin city: ${error}`);
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      )
        throw error;
      else
        throw new InternalServerErrorException(
          'Error adding aboard points to origin city',
        );
    }
  }

  private async mapToDTO(
    jsonObject: OriginCityExcel[],
  ): Promise<CreateOriginCityDTO[]> {
    const mappedOriginCities = jsonObject.map(async (originCity) => {
      const { puntosDeAbordaje } = originCity;
      const aboardPoints = await this.aboardPointService.mapFromNameToObjectId(
        puntosDeAbordaje?.split(','),
      );
      const originCityDTO: CreateOriginCityDTO = {
        state: originCity.estado,
        name: originCity.nombre,
        status: originCity.status as Status,
        aboardPoints,
      };
      return originCityDTO;
    });

    return Promise.all(mappedOriginCities);
  }

  async loadFromExcel(filePath: string): Promise<void> {
    try {
      this.logger.debug(`Loading origin cities from excel`);
      const jsonObject: OriginCityExcel[] =
        this.filerService.excelToJson(filePath);
      const originCitiesDTO = await this.mapToDTO(jsonObject);
      await this.originCityModel.insertMany(originCitiesDTO);
    } catch (error) {
      this.logger.error(`Error loading origin cities from excel: ${error}`);
      throw new InternalServerErrorException(
        `Error loading origin cities from excel: ${error}`,
      );
    }
  }
}
