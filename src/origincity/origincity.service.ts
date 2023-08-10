import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { QueryDTO } from 'src/shared/dtos/query.dto';
import { SearcherDTO } from 'src/shared/dtos/searcher.dto';
import { Status } from 'src/shared/enums/status.enum';
import { PaginateResult } from 'src/shared/interfaces/paginate.interface';
import { CreateOriginCityDTO } from 'src/shared/models/dtos/originCity/createorigincity.dto';
import { UpdateOriginCityDTO } from 'src/shared/models/dtos/originCity/updateorigincity.dto';
import { OriginCity } from 'src/shared/models/schemas/origincity.schema';
import { UrlValidator } from 'src/shared/validators/urlValidator.dto';

@Injectable()
export class OriginCityService {
  constructor(
    @InjectModel(OriginCity.name)
    private readonly originCityModel: Model<OriginCity>,
  ) {}

  private readonly logger = new Logger(OriginCityService.name);

  async create(createOriginCityDTO: CreateOriginCityDTO): Promise<OriginCity> {
    try {
      this.logger.debug(
        `creating new origin city: ${JSON.stringify(createOriginCityDTO)}`,
      );
      const createdOriginCity = new this.originCityModel(createOriginCityDTO);
      return createdOriginCity.save();
    } catch (error) {
      this.logger.error(
        `error creating new origin city: ${JSON.stringify(error)}`,
      );
      throw new InternalServerErrorException(
        `Error creating origin city: ${error}`,
      );
    }
  }

  async findOne({ id }: UrlValidator): Promise<OriginCity> {
    try {
      this.logger.debug(`getting origin city: ${id}`);
      return this.originCityModel
        .findById(id)
        .select({ _id: 0, __v: 0, createdAt: 0 })
        .populate('aboardPoints')
        .exec();
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
    status = Status.ACTIVE,
  }: QueryDTO): Promise<PaginateResult<OriginCity> | Array<OriginCity>> {
    try {
      this.logger.debug(`getting all origin cities`);
      if (page && limit) {
        const docs = await this.originCityModel
          .find({ status })
          .limit(limit * 1)
          .skip((page - 1) * limit)
          .select({ __v: 0, createdAt: 0 })
          .exec();
        const totalDocs = await this.originCityModel
          .countDocuments({ status })
          .exec();
        return {
          docs,
          totalDocs,
          hasPrevPage: page > 1,
          hasNextPage: page < Math.ceil(totalDocs / limit),
          page,
          totalPages: Math.ceil(totalDocs / limit),
        };
      }

      return this.originCityModel.find({ status }).exec();
    } catch (error) {
      this.logger.error(`error getting all origin cities: ${error}`);
      throw new InternalServerErrorException(
        `Error getting all origin cities: ${error}`,
      );
    }
  }

  private async validateOriginCity(id: string): Promise<boolean> {
    try {
      this.logger.debug('Validating OriginCity');
      const validOrigin = await this.originCityModel.findById(id);
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
  ): Promise<OriginCity> {
    try {
      this.logger.debug('Updating origin city');
      if (await this.validateOriginCity(id))
        return this.originCityModel
          .findByIdAndUpdate(id, updateOriginCity, { new: true })
          .exec();
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

  async delete({ id }: UrlValidator): Promise<OriginCity> {
    try {
      this.logger.debug('Deleting origin city');
      if (await this.validateOriginCity(id))
        return this.originCityModel
          .findByIdAndUpdate(id, { status: Status.INACTIVE }, { new: true })
          .exec();
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

  async reactivate({ id }: UrlValidator): Promise<OriginCity> {
    try {
      this.logger.debug('Reactivating OriginCity');
      if (await this.validateOriginCity(id))
        return this.originCityModel
          .findByIdAndUpdate(id, { status: Status.ACTIVE }, { new: true })
          .exec();
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

  async searcher({ word, status }: SearcherDTO): Promise<Array<OriginCity>> {
    try {
      this.logger.debug(`Searching origin cities: ${word}`);
      return this.originCityModel
        .find({
          $or: [
            { name: { $regex: word, $options: 'i' } },
            { country: { $regex: word, $options: 'i' } },
          ],
          status,
        })
        .exec();
    } catch (error) {
      this.logger.error(`Error searching origin cities: ${error}`);
      throw new InternalServerErrorException(
        `Error searching origin cities: ${error}`,
      );
    }
  }

  async addAboardPoints(
    { id }: UrlValidator,
    { aboardPoints }: UpdateOriginCityDTO,
  ): Promise<OriginCity> {
    try {
      this.logger.debug(`Adding aboard points to origin city: ${id}`);
      if (await this.validateOriginCity(id))
        return this.originCityModel
          .findByIdAndUpdate(id, { $push: { aboardPoints } }, { new: true })
          .exec();
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
}
