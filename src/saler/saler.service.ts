import { QueryDTO } from '@/shared/dtos/query.dto';
import { PaginateResult } from '@/shared/interfaces/paginate.interface';
import { Salers } from '@/shared/models/schemas/saler.schema';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class SalerService {
  constructor(
    @InjectModel(Salers.name) private readonly salersModel: Model<Salers>,
  ) {}

  private readonly logger = new Logger(SalerService.name);

  async findAll({
    limit,
    page,
    status,
  }: QueryDTO): Promise<PaginateResult<Salers>> {
    try {
      this.logger.debug(`getting all salers`);
      const docs = status
        ? await this.salersModel
            .find({ status })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .populate('salerType')
            .select({ __v: 0, createdAt: 0 })
            .lean()
        : await this.salersModel
            .find()
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .populate('salerType')
            .select({ __v: 0, createdAt: 0 })
            .lean();
      if (!docs.length) throw new NotFoundException('No salers registered.');
      const totalDocs = status
        ? await this.salersModel.countDocuments({ status })
        : await this.salersModel.countDocuments();

      return {
        totalDocs,
        page,
        totalPages: Math.ceil(totalDocs / limit),
        hasPrevPage: page > 1,
        hasNextPage: page < Math.ceil(totalDocs / limit),
        docs,
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
}
