import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Itineraries } from '../shared/models/schemas/itinerary.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { PaginatedTourDTO } from '@/shared/models/dtos/tour/paginatedTour.dto';
import { PaginateResult } from '@/shared/interfaces/paginate.interface';

@Injectable()
export class ItineraryService {
  constructor(
    @InjectModel(Itineraries.name)
    private readonly itinerariesModel: Model<Itineraries>,
  ) {}

  private readonly logger = new Logger(ItineraryService.name);

  async findAll({
    page,
    limit,
    status,
  }: PaginatedTourDTO): Promise<PaginateResult<Itineraries>> {
    try {
      const docs = status
        ? await this.itinerariesModel
            .find({ status })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .select({ __v: 0, createdAt: 0 })
            .lean()
        : await this.itinerariesModel
            .find()
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .select({ __v: 0, createdAt: 0 })
            .lean();
      if (docs.length === 0)
        throw new NotFoundException('No itineraries registered.');
      const totalDocs = status
        ? await this.itinerariesModel.countDocuments({ status }).exec()
        : await this.itinerariesModel.countDocuments().exec();

      const paginatedItineraries: PaginateResult<Itineraries> = {
        docs,
        totalDocs,
        hasPrevPage: page > 1,
        hasNextPage: page < Math.ceil(totalDocs / limit),
        page,
        totalPages: Math.ceil(totalDocs / limit),
      };

      return paginatedItineraries;
    } catch (error) {
      this.logger.error(`Error getting all itineraries: ${error}`);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'Something went wrong while getting itineraries.',
      );
    }
  }
}
