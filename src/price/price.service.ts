import { Prices } from '@/shared/models/schemas/price.schema';
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
export class PriceService {
  constructor(
    @InjectModel(Prices.name) private readonly priceModel: Model<Prices>,
  ) {}

  readonly logger = new Logger(PriceService.name);

  async getPrice({ id }: UrlValidator): Promise<Prices> {
    try {
      this.logger.log(`Looking for price with id: ${id}`);
      const price = await this.priceModel.findById(id).lean();
      if (!price) {
        this.logger.error(`Price with id: ${id} not found`);
        throw new NotFoundException(`Price with id: ${id} not found`);
      }
      return price;
    } catch (error) {
      this.logger.error(`Something went wrong while getting price: ${error}`);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'Something went wrong while getting price.',
      );
    }
  }
}
