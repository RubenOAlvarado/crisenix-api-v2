import { IncludedLean } from '@/shared/interfaces/included/included.lean.interface';
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
}
