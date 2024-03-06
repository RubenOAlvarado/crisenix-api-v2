import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Itineraries } from '../shared/models/schemas/itinerary.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateResult } from '@/shared/interfaces/paginate.interface';
import {
  createPaginatedObject,
  handleErrorsOnServices,
} from '@/shared/utilities/helpers';
import { CreateItineraryDTO } from '@/shared/models/dtos/itinerary/createitinerary.dto';
import { QueryDTO } from '@/shared/dtos/query.dto';
import { UrlValidator } from '@/shared/validators/urlValidator.dto';
import { UpdateItineraryDTO } from '@/shared/models/dtos/itinerary/updateitinerary.dto';

@Injectable()
export class ItineraryService {
  constructor(
    @InjectModel(Itineraries.name)
    private readonly itinerariesModel: Model<Itineraries>,
  ) {}

  private readonly logger = new Logger(ItineraryService.name);

  async create(body: CreateItineraryDTO): Promise<Itineraries> {
    try {
      const newItinerary = new this.itinerariesModel(body);
      return await newItinerary.save();
    } catch (error) {
      this.logger.error(`Error creating itinerary: ${error}`);
      throw new InternalServerErrorException(
        'Something went wrong while creating itinerary.',
      );
    }
  }

  async findAll({
    page,
    limit,
    status,
  }: QueryDTO): Promise<PaginateResult<Itineraries>> {
    try {
      const query = status ? { status } : {};
      const docs = await this.itinerariesModel
        .find(query)
        .populate('clasification')
        .limit(limit)
        .skip(limit * (page - 1))
        .exec();
      if (docs.length === 0)
        throw new NotFoundException('Itineraries not found.');

      const totalDocs = await this.itinerariesModel
        .countDocuments(query)
        .exec();

      return createPaginatedObject<Itineraries>(docs, totalDocs, page, limit);
    } catch (error) {
      this.logger.error(
        `Something went wrong while getting itineraries: ${error}`,
      );
      throw handleErrorsOnServices(
        'Something went wrong while getting itineraries',
        error,
      );
    }
  }

  async findById({ id }: UrlValidator): Promise<Itineraries> {
    try {
      const itinerary = await this.itinerariesModel
        .findById(id)
        .populate('clasification')
        .exec();
      if (!itinerary) throw new NotFoundException('Itinerary not found.');
      return itinerary;
    } catch (error) {
      this.logger.error(
        'Something went wrong while getting itinerary: ',
        error,
      );
      throw handleErrorsOnServices(
        'Something went wrong while getting itinerary.',
        error,
      );
    }
  }

  async update(
    body: UpdateItineraryDTO,
    { id }: UrlValidator,
  ): Promise<Itineraries> {
    try {
      const itinerary = await this.itinerariesModel
        .findByIdAndUpdate(id, body, { new: true })
        .exec();
      if (!itinerary) throw new NotFoundException('Itinerary not found.');
      return itinerary;
    } catch (error) {
      this.logger.error(
        'Something went wrong while updating itinerary: ',
        error,
      );
      throw handleErrorsOnServices(
        'Something went wrong while updating itinerary.',
        error,
      );
    }
  }

  async delete({ id }: UrlValidator): Promise<void> {
    try {
      const itinerary = await this.itinerariesModel
        .findByIdAndDelete(id)
        .exec();
      if (!itinerary) throw new NotFoundException('Itinerary not found.');
    } catch (error) {
      this.logger.error(
        'Something went wrong while deleting itinerary: ',
        error,
      );
      throw handleErrorsOnServices(
        'Something went wrong while deleting itinerary.',
        error,
      );
    }
  }

  async reactivate({ id }: UrlValidator): Promise<Itineraries> {
    try {
      const itinerary = await this.itinerariesModel
        .findByIdAndUpdate(id, { status: 'active' }, { new: true })
        .exec();
      if (!itinerary) throw new NotFoundException('Itinerary not found.');
      return itinerary;
    } catch (error) {
      this.logger.error(
        'Something went wrong while reactivating itinerary: ',
        error,
      );
      throw handleErrorsOnServices(
        'Something went wrong while reactivating itinerary.',
        error,
      );
    }
  }
}
