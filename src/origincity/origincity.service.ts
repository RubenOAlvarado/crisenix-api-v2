import { OriginCityLean } from '@/shared/interfaces/origincity/originCity.lean.interface';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { QueryDTO } from 'src/shared/dtos/query.dto';
import { Status } from 'src/shared/enums/status.enum';
import { PaginateResult } from 'src/shared/interfaces/paginate.interface';
import { OriginCities } from 'src/shared/models/schemas/origincity.schema';
import { UrlValidator } from 'src/shared/validators/urlValidator.dto';
import {
  createPaginatedObject,
  handleErrorsOnServices,
} from '@/shared/utilities/helpers';
import { CreateOriginCityDTO } from '@/shared/models/dtos/request/originCity/createorigincity.dto';
import { UpdateOriginCityDTO } from '@/shared/models/dtos/request/originCity/updateorigincity.dto';
import { OriginCityExcel } from '@/shared/interfaces/excel/originCity.excel.interface';
import { AboardpointService } from '@/aboardpoint/aboardpoint.service';
import { OriginCitySearcherDto } from '@/shared/dtos/searcher/originCity/searcherOriginCity.dto';

@Injectable()
export class OriginCityService {
  constructor(
    @InjectModel(OriginCities.name)
    private readonly originCityModel: Model<OriginCities>,
    private readonly aboardPointService: AboardpointService,
  ) {}

  async create(
    createOriginCityDTO: CreateOriginCityDTO,
  ): Promise<OriginCityLean> {
    try {
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
        .select({ __v: 0, createdAt: 0 })
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

  async searcher({
    word,
  }: OriginCitySearcherDto): Promise<Array<OriginCityLean>> {
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

  async validateFromPriceExcel(name?: string): Promise<string> {
    try {
      if (!name) throw new BadRequestException('No origin city provided.');
      const sanitizedCity = name.trim();
      const originCity = await this.originCityModel
        .findOne({ name: sanitizedCity })
        .select({ _id: 1 })
        .lean();
      if (!originCity) throw new NotFoundException('Origin city not found.');
      return originCity._id.toString();
    } catch (error) {
      throw handleErrorsOnServices('Error validating origin city.', error);
    }
  }

  async insertOriginCityBunch(jsonObject: OriginCityExcel[]): Promise<void> {
    try {
      const originCityDTO = await this.mapToDto(jsonObject);
      await this.originCityModel.insertMany(originCityDTO);
    } catch (error) {
      throw handleErrorsOnServices('Error inserting origin cities.', error);
    }
  }

  private async mapToDto(
    jsonObject: OriginCityExcel[],
  ): Promise<CreateOriginCityDTO[]> {
    try {
      const mappedDTO: CreateOriginCityDTO[] = [];
      for (const { nombre, estado, puntosDeAscenso } of jsonObject) {
        const aboardPoints = puntosDeAscenso
          ? await this.aboardPointService.mapFromNameToObjectId(
              puntosDeAscenso.split(','),
            )
          : undefined;
        const dto: CreateOriginCityDTO = {
          name: nombre,
          state: estado ?? '',
          aboardPoints,
        };
        mappedDTO.push(dto);
      }
      return mappedDTO;
    } catch (error) {
      throw handleErrorsOnServices('Error mapping origin cities.', error);
    }
  }

  async mapFromDestinationExcel(names: string[]): Promise<string[]> {
    try {
      if (!names?.length) {
        throw new BadRequestException('No origin cities provided.');
      }
      const cities = [];
      for (const name of names) {
        const sanitizedCity = name.trim();
        const originCity = await this.originCityModel
          .findOne({ name: sanitizedCity })
          .lean();
        if (!originCity) throw new NotFoundException('Origin city not found.');
        cities.push(originCity._id.toString());
      }
      return cities;
    } catch (error) {
      throw handleErrorsOnServices('Error validating origin city.', error);
    }
  }
}
