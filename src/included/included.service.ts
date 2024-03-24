import { QueryDTO } from '@/shared/dtos/query.dto';
import { Entry } from '@/shared/enums/entry.enum';
import { HotelStatus } from '@/shared/enums/hotelstatus.enum';
import { Status } from '@/shared/enums/status.enum';
import { PaginateResult } from '@/shared/interfaces/paginate.interface';
import { CreateIncludedDTO } from '@/shared/models/dtos/request/included/createincluded.dto';
import { UpdateIncludedDTO } from '@/shared/models/dtos/request/included/updateincluded.dto';
import { ResponseIncludedDTO } from '@/shared/models/dtos/response/included/responseIncluded.dto';
import { Includeds } from '@/shared/models/schemas/included.schema';
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
export class IncludedService {
  constructor(
    @InjectModel(Includeds.name)
    private readonly includedModel: Model<Includeds>,
  ) {}

  private readonly logger = new Logger(IncludedService.name);

  async create(
    createIncludedDTO: CreateIncludedDTO,
  ): Promise<ResponseIncludedDTO> {
    try {
      const createdIncluded = new this.includedModel(createIncludedDTO);
      const savedIncluded = await createdIncluded.save();
      return {
        ...savedIncluded,
        entry: savedIncluded?.entry as Entry,
        hotelStatus: savedIncluded?.hotelStatus as HotelStatus,
      };
    } catch (error) {
      this.logger.error(
        `Something went wrong while creating included service: ${error}`,
      );
      throw new InternalServerErrorException(
        'Something went wrong while creating included service.',
      );
    }
  }

  async findOne({ id }: UrlValidator): Promise<ResponseIncludedDTO> {
    try {
      const included = await this.includedModel
        .findById(id)
        .select({ __v: 0, createdAt: 0 })
        .lean();
      if (!included) throw new NotFoundException('Included service not found.');
      return {
        ...included,
        entry: included?.entry as Entry,
        hotelStatus: included?.hotelStatus as HotelStatus,
      };
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong finding included service',
        error,
      );
    }
  }

  async findAll({
    page,
    limit,
    status,
  }: QueryDTO): Promise<PaginateResult<ResponseIncludedDTO>> {
    try {
      const query = status ? { status } : {};
      const docs = await this.includedModel
        .find(query)
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .select({ __v: 0, createdAt: 0 })
        .lean();
      if (!docs.length)
        throw new NotFoundException('No included services registered.');
      const totalDocs = await this.includedModel.countDocuments(query).exec();
      const mappedDocs = docs.map((included) => ({
        ...included,
        entry: included?.entry as Entry,
        hotelStatus: included?.hotelStatus as HotelStatus,
      }));
      return createPaginatedObject<ResponseIncludedDTO>(
        mappedDocs,
        totalDocs,
        page,
        limit,
      );
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong finding included services',
        error,
      );
    }
  }

  async update(
    { id }: UrlValidator,
    body: UpdateIncludedDTO,
  ): Promise<ResponseIncludedDTO> {
    try {
      const included = await this.includedModel
        .findByIdAndUpdate(id, body, { new: true })
        .select({ __v: 0, createdAt: 0 })
        .lean();
      if (!included) throw new NotFoundException('Included service not found.');
      return {
        ...included,
        entry: included?.entry as Entry,
        hotelStatus: included?.hotelStatus as HotelStatus,
      };
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong updating included service',
        error,
      );
    }
  }

  async delete({ id }: UrlValidator): Promise<void> {
    try {
      const included = await this.includedModel
        .findByIdAndUpdate(id, { status: Status.INACTIVE }, { new: true })
        .select({ __v: 0, createdAt: 0 })
        .lean();
      if (!included) throw new NotFoundException('Included service not found.');
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong deleting included service',
        error,
      );
    }
  }

  async reactivate({ id }: UrlValidator): Promise<void> {
    try {
      const included = await this.includedModel
        .findByIdAndUpdate(id, { status: Status.ACTIVE }, { new: true })
        .exec();
      if (!included) throw new NotFoundException('Included service not found.');
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong reactivating included service',
        error,
      );
    }
  }
}
