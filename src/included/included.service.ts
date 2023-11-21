import { QueryDTO } from '@/shared/dtos/query.dto';
import { IncludedLean } from '@/shared/interfaces/included/included.lean.interface';
import { PaginateResult } from '@/shared/interfaces/paginate.interface';
import { Includeds } from '@/shared/models/schemas/included.schema';
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

  async findOne({ id }: UrlValidator): Promise<IncludedLean> {
    try {
      this.logger.debug(`finding included service with id: ${id}`);
      const destination = await this.includedModel
        .findById(id)
        .select({ __v: 0, createdAt: 0 })
        .lean();
      if (!destination)
        throw new NotFoundException('Included service not found.');
      return destination;
    } catch (error) {
      this.logger.error(
        `Something went wrong while finding included service: ${error}`,
      );
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'Something went wrong while finding included service.',
      );
    }
  }

  async findAll({
    page,
    limit,
    status,
  }: QueryDTO): Promise<PaginateResult<IncludedLean>> {
    try {
      this.logger.debug(`finding all included services.`);
      const docs = status
        ? await this.includedModel
            .find({ status })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .select({ __v: 0, createdAt: 0 })
            .lean()
        : await this.includedModel
            .find()
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .select({ __v: 0, createdAt: 0 })
            .lean();
      if (!docs.length)
        throw new NotFoundException('No included services registered.');
      const totalDocs = status
        ? await this.includedModel.countDocuments({ status }).exec()
        : await this.includedModel.countDocuments().exec();
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
        `Something went wrong while finding included services: ${error}`,
      );
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'Something went wrong while finding included services.',
      );
    }
  }
}
