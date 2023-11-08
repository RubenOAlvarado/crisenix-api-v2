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
        .lean();
      if (!destination) throw new NotFoundException('Destination not found.');
      return destination;
    } catch (error) {
      this.logger.error(
        `Something went wrong while finding destination: ${error}`,
      );
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'Something went wrong while finding category',
      );
    }
  }
}
