import { OriginCityLean } from '@/shared/types/origincity/originCity.lean.type';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Status } from 'src/shared/enums/status.enum';
import {
  OriginCities,
  OriginCityDocument,
} from 'src/shared/models/schemas/origincity.schema';
import { IdValidator } from '@/shared/models/dtos/validators/id.validator';
import { handleErrorsOnServices } from '@/shared/utilities/helpers';
import { CreateOriginCityDTO } from '@/shared/models/dtos/request/originCity/createorigincity.dto';
import { UpdateOriginCityDTO } from '@/shared/models/dtos/request/originCity/updateorigincity.dto';
import { StatusDTO } from '@/shared/models/dtos/searcher/statusparam.dto';

@Injectable()
export class OriginCityService {
  constructor(
    @InjectModel(OriginCities.name)
    private readonly originCityModel: Model<OriginCities>,
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

  async findOne({ id }: IdValidator): Promise<OriginCityLean> {
    try {
      const city = await this.originCityModel
        .findById(id)
        .select({ __v: 0, createdAt: 0 })
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

  async findAll({ status }: StatusDTO): Promise<OriginCityDocument[]> {
    try {
      const query = status ? { status } : {};
      const originCities = await this.originCityModel
        .find(query)
        .select({ __v: 0, createdAt: 0 })
        .exec();
      if (!originCities) throw new NotFoundException('Origin cities not found');
      return originCities;
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong while finding origin cities.',
        error,
      );
    }
  }

  private async validateOriginCity(id: string, status: string = Status.ACTIVE) {
    try {
      const city = await this.originCityModel.findById(id);
      if (!city) throw new NotFoundException(`OriginCity ${id} was not found`);
      if (status === Status.INACTIVE && city.status !== Status.ACTIVE)
        throw new BadRequestException('OriginCity must be in active status');
      if (status === Status.ACTIVE && city.status !== Status.INACTIVE)
        throw new BadRequestException('OriginCity must be in inactive status');

      return city;
    } catch (e) {
      throw handleErrorsOnServices(
        'Something went wrong validating origin city.',
        e,
      );
    }
  }

  async update(
    { id }: IdValidator,
    updateOriginCity: UpdateOriginCityDTO,
  ): Promise<OriginCityLean> {
    try {
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

  async changeStatus(
    { id }: IdValidator,
    { status }: StatusDTO,
  ): Promise<void> {
    try {
      const cityToUpdate = await this.validateOriginCity(id, status);
      cityToUpdate.status =
        status === Status.ACTIVE ? Status.ACTIVE : Status.INACTIVE;
      await cityToUpdate.save();
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong validating origin city.',
        error,
      );
    }
  }

  async findByName(name?: string): Promise<OriginCityLean | undefined | null> {
    try {
      if (!name) throw new BadRequestException('Name is required');
      const city = await this.originCityModel.findOne({ name }).lean();
      return city;
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong while finding origin city.',
        error,
      );
    }
  }
}
