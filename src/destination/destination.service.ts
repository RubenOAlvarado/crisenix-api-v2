import { SearcherDTO } from '@/shared/dtos/searcher.dto';
import { DestinationLean } from '@/shared/interfaces/destination/destination.interface';
import { Destinations } from '@/shared/models/schemas/destination.schema';
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
export class DestinationService {
  constructor(
    @InjectModel(Destinations.name)
    private readonly destinationModel: Model<Destinations>,
  ) {}

  private readonly logger = new Logger(DestinationService.name);

  async findOne({ id }: UrlValidator): Promise<DestinationLean> {
    try {
      this.logger.debug(`finding destination with id: ${id}`);
      const destination = await this.destinationModel
        .findById(id)
        .populate('originCity')
        .populate('category')
        .populate('translationType')
        .select({ __v: 0, createdAt: 0 })
        .lean();
      if (!destination) throw new NotFoundException('Destination not found.');
      return destination;
    } catch (error) {
      this.logger.error(
        `Something went wrong while finding destination: ${error}`,
      );
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'Something went wrong while finding destination.',
      );
    }
  }

  async search({ word, status }: SearcherDTO): Promise<Array<DestinationLean>> {
    try {
      this.logger.debug(
        `Looking destinations that contains: ${word} with status: ${status}`,
      );
      return this.destinationModel
        .aggregate()
        .lookup({
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'category',
        })
        .unwind({
          path: '$category',
          preserveNullAndEmptyArrays: true,
        })
        .match({
          status,
          $or: [
            { description: new RegExp(word, 'i') },
            { code: new RegExp(word, 'i') },
            { name: new RegExp(word, 'i') },
            { 'category.label': new RegExp(word, 'i') },
          ],
        });
    } catch (e) {
      this.logger.error(`Error looking destination with value ${word}: ${e}`);
      throw new InternalServerErrorException(
        `Error looking destination with value ${word}`,
      );
    }
  }
}
