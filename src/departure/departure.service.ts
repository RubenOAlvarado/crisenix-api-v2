import { QueryDTO } from '@/shared/dtos/query.dto';
import { Status } from '@/shared/enums/status.enum';
import { DepartureLean } from '@/shared/interfaces/departure/departure.lean.interface';
import { CreateDepartureDTO } from '@/shared/models/dtos/departure/createdeparture.dto';
import { UpdateDepartureDTO } from '@/shared/models/dtos/departure/updatedeparture.dto';
import { Departures } from '@/shared/models/schemas/departure.schema';
import {
  createPaginatedObject,
  handleErrorsOnServices,
} from '@/shared/utilities/helpers';
import { UrlValidator } from '@/shared/validators/urlValidator.dto';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class DepartureService {
  constructor(
    @InjectModel(Departures.name)
    private readonly departureModel: Model<Departures>,
  ) {}

  private readonly logger = new Logger(DepartureService.name);

  async create(departure: CreateDepartureDTO) {
    try {
      const createdDeparture = new this.departureModel(departure);
      return await createdDeparture.save();
    } catch (error) {
      this.logger.error(`Something went wrong creating departure: ${error}`);
      throw new InternalServerErrorException(
        'Something went wrong creating departure.',
      );
    }
  }

  async findAll({ page, limit, status }: QueryDTO) {
    try {
      const query = status ? { status } : {};
      const docs = await this.departureModel
        .find(query)
        .limit(limit)
        .skip((page - 1) * limit)
        .select({ __v: 0, createdAt: 0 })
        .lean();
      if (!docs.length) {
        this.logger.error('Departures not found.');
        throw new NotFoundException('Departures not found.');
      }
      const totalDocs = await this.departureModel.countDocuments(query);
      return createPaginatedObject<DepartureLean>(docs, totalDocs, page, limit);
    } catch (error) {
      this.logger.error(`Something went wrong finding departures: ${error}`);
      throw handleErrorsOnServices(
        'Something went wrong finding departures.',
        error,
      );
    }
  }

  async findOne({ id }: UrlValidator) {
    try {
      const departure = await this.departureModel
        .findById(id)
        .select({ __v: 0, createdAt: 0 })
        .lean();
      if (!departure) {
        this.logger.error('Departure not found.');
        throw new NotFoundException('Departure not found.');
      }
      return departure;
    } catch (error) {
      this.logger.error(`Something went wrong finding departure: ${error}`);
      throw handleErrorsOnServices(
        'Something went wrong finding departure.',
        error,
      );
    }
  }

  async update({ id }: UrlValidator, body: UpdateDepartureDTO) {
    try {
      const departure = await this.departureModel.findByIdAndUpdate(id, body, {
        new: true,
      });
      if (!departure) {
        this.logger.error('Departure not found.');
        throw new NotFoundException('Departure not found.');
      }
      return departure;
    } catch (error) {
      this.logger.error(`Something went wrong updating departure: ${error}`);
      throw handleErrorsOnServices(
        'Something went wrong updating departure.',
        error,
      );
    }
  }

  async delete({ id }: UrlValidator) {
    try {
      const departure = await this.departureModel.findByIdAndUpdate(
        id,
        { status: Status.INACTIVE },
        { new: true },
      );
      if (!departure) {
        this.logger.error('Departure not found.');
        throw new NotFoundException('Departure not found.');
      }
    } catch (error) {
      this.logger.error(`Something went wrong deleting departure: ${error}`);
      throw handleErrorsOnServices(
        'Something went wrong deleting departure.',
        error,
      );
    }
  }

  async reactivate({ id }: UrlValidator) {
    try {
      const departure = await this.departureModel.findByIdAndUpdate(
        id,
        { status: Status.ACTIVE },
        { new: true },
      );
      if (!departure) {
        this.logger.error('Departure not found.');
        throw new NotFoundException('Departure not found.');
      }
      return departure;
    } catch (error) {
      this.logger.error(
        `Something went wrong reactivating departure: ${error}`,
      );
      throw handleErrorsOnServices(
        'Something went wrong reactivating departure.',
        error,
      );
    }
  }
}
