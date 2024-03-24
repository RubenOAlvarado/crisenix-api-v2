import { OriginCityLean } from '@/shared/interfaces/origincity/originCity.lean.interface';
import { mapCitiesFromDestinationExcel } from '@/shared/utilities/originCity.helpers';
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
import { SearcherDTO } from '@/shared/enums/searcher/destination/searcher.dto';
import { Status } from 'src/shared/enums/status.enum';
import { OriginCityExcel } from 'src/shared/interfaces/excel/originCity.excel.interface';
import { PaginateResult } from 'src/shared/interfaces/paginate.interface';
import { OriginCity } from 'src/shared/models/schemas/origincity.schema';
import { UrlValidator } from 'src/shared/validators/urlValidator.dto';
import {
  createPaginatedObject,
  handleErrorsOnServices,
} from '@/shared/utilities/helpers';
import { CreateOriginCityDTO } from '@/shared/models/dtos/request/originCity/createorigincity.dto';
import { UpdateOriginCityDTO } from '@/shared/models/dtos/request/originCity/updateorigincity.dto';

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
  ): Promise<OriginCityLean> {
    try {
      this.logger.debug(`creating new origin city`);
      const createdOriginCity = new this.originCityModel(createOriginCityDTO);
      return createdOriginCity.save();
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong creating origin city.',
        error,
      );
    }
  }

  async findOne({ id }: UrlValidator): Promise<OriginCityLean> {
    try {
      const city = await this.originCityModel
        .findById(id)
        .select({ _id: 0, __v: 0, createdAt: 0 })
        .populate('aboardPoints')
        .lean();
      if (!city) throw new NotFoundException('Origin city not found.');
      return city;
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong while finding origin city.',
        error,
      );
    }
  }

  async findAll({
    page,
    limit,
    status,
  }: QueryDTO): Promise<PaginateResult<OriginCityLean>> {
    try {
      const Query = status ? { status } : {};
      const docs = await this.originCityModel
        .find(Query)
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .populate('aboardPoints')
        .select({ __v: 0, createdAt: 0 })
        .lean();
      if (!docs.length)
        throw new NotFoundException('No origin cities registered.');
      const totalDocs = await this.originCityModel.countDocuments(Query).exec();
      return createPaginatedObject<OriginCityLean>(
        docs,
        totalDocs,
        page,
        limit,
      );
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong while finding origin cities.',
        error,
      );
    }
  }

  private async validateOriginCity(id: string): Promise<boolean> {
    try {
      const validOrigin = await this.originCityModel.findById(id).lean();
      if (!validOrigin)
        throw new NotFoundException(`OriginCity ${id} was not found`);
      if (validOrigin.status !== Status.ACTIVE)
        throw new BadRequestException('OriginCity must be in active status');

      return true;
    } catch (e) {
      throw handleErrorsOnServices(
        'Something went wrong validating origin city.',
        e,
      );
    }
  }

  async update(
    { id }: UrlValidator,
    updateOriginCity: UpdateOriginCityDTO,
  ): Promise<OriginCityLean> {
    try {
      await this.validateOriginCity(id);
      const updatedOriginCity = await this.originCityModel.findByIdAndUpdate(
        id,
        updateOriginCity,
        {
          new: true,
        },
      );
      if (!updatedOriginCity)
        throw new NotFoundException(`OriginCity ${id} was not found`);
      return updatedOriginCity;
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong validating origin city.',
        error,
      );
    }
  }

  async delete({ id }: UrlValidator): Promise<void> {
    try {
      if (await this.validateOriginCity(id))
        await this.originCityModel.findByIdAndUpdate(
          id,
          { status: Status.INACTIVE },
          { new: true },
        );
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong validating origin city.',
        error,
      );
    }
  }

  async reactivate({ id }: UrlValidator): Promise<void> {
    try {
      if (await this.validateOriginCity(id))
        await this.originCityModel.findByIdAndUpdate(
          id,
          { status: Status.ACTIVE },
          { new: true },
        );
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong reactivating origin city.',
        error,
      );
    }
  }

  async searcher({ word }: SearcherDTO): Promise<Array<OriginCityLean>> {
    try {
      const searchResult = await this.originCityModel
        .find({
          $or: [
            { name: { $regex: word, $options: 'i' } },
            { country: { $regex: word, $options: 'i' } },
          ],
        })
        .populate('aboardPoints')
        .select({ __v: 0, createdAt: 0 })
        .lean();
      if (!searchResult.length)
        throw new NotFoundException('Any origin city match your search.');
      return searchResult;
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong searching origin city.',
        error,
      );
    }
  }

  async addAboardPoints(
    { id }: UrlValidator,
    { aboardPoints }: UpdateOriginCityDTO,
  ): Promise<void> {
    try {
      if (await this.validateOriginCity(id))
        await this.originCityModel.findByIdAndUpdate(
          id,
          { $push: { aboardPoints } },
          { new: true },
        );
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong adding aboard points to origin city.',
        error,
      );
    }
  }

  private async mapToDTO(
    jsonObject: OriginCityExcel[],
  ): Promise<CreateOriginCityDTO[]> {
    const mappedOriginCities = await Promise.all(
      jsonObject.map(async (originCity) => {
        const { puntosDeAbordaje, estado, nombre, status } = originCity;

        const aboardPoints =
          await this.aboardPointService.mapFromNameToObjectId(
            puntosDeAbordaje?.split(','),
          );

        return {
          state: estado,
          name: nombre,
          status: status as Status,
          aboardPoints,
        } as CreateOriginCityDTO;
      }),
    );

    return mappedOriginCities;
  }

  async loadFromExcel(filePath: string): Promise<void> {
    try {
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

  async mapFromDestinationExcel(originCities: string): Promise<string[]> {
    try {
      this.logger.debug(`Mapping origin cities from destination excel`);

      const mappedCitiesFromExcel = mapCitiesFromDestinationExcel(originCities);

      const mappedCities = await Promise.all(
        mappedCitiesFromExcel.map(async (city) => {
          const existingCity = await this.originCityModel
            .findOne({ name: city.name })
            .lean();

          if (!existingCity) {
            const mappedAboardPoints =
              await this.aboardPointService.mapFromNameToObjectId(
                city.aboardPoints,
              );

            const createdOriginCity = await this.create({
              name: city.name as string,
              state: city.state as Status,
              aboardPoints: mappedAboardPoints,
            });

            return createdOriginCity._id.toString();
          }

          return existingCity._id.toString();
        }),
      );

      return mappedCities;
    } catch (error) {
      throw handleErrorsOnServices('Error mapping cities from excel', error);
    }
  }
}
