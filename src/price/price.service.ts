import { QueryDTO } from '@/shared/dtos/query.dto';
import { Status } from '@/shared/enums/status.enum';
import { PaginateResult } from '@/shared/interfaces/paginate.interface';
import { CreatePriceDTO } from '@/shared/models/dtos/price/createprice.dto';
import { UpdatePriceDTO } from '@/shared/models/dtos/price/updateprice.dto';
import { Prices } from '@/shared/models/schemas/price.schema';
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
export class PriceService {
  constructor(
    @InjectModel(Prices.name) private readonly priceModel: Model<Prices>,
  ) {}

  readonly logger = new Logger(PriceService.name);

  async createPrice(createPriceDTO: CreatePriceDTO): Promise<Prices> {
    try {
      this.logger.log('Creating price');
      const price = new this.priceModel(createPriceDTO);
      return await price.save();
    } catch (error) {
      this.logger.error(`Something went wrong while creating price: ${error}`);
      throw new InternalServerErrorException(
        'Something went wrong while creating price.',
      );
    }
  }

  async getPrices({
    page,
    limit,
    status,
  }: QueryDTO): Promise<PaginateResult<Prices>> {
    try {
      this.logger.log('Getting prices');
      const query = status ? { status } : {};
      const docs = await this.priceModel
        .find(query)
        .populate('city')
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .select({ __v: 0, createdAt: 0 })
        .lean();
      if (!docs.length) {
        this.logger.error('Prices not found');
        throw new NotFoundException('Prices not found');
      }
      const totalDocs = await this.priceModel.countDocuments(query).exec();
      return createPaginatedObject<Prices>(docs, totalDocs, page, limit);
    } catch (error) {
      this.logger.error(`Something went wrong while getting prices: ${error}`);
      throw handleErrorsOnServices(
        'Something went wrong while getting prices.',
        error,
      );
    }
  }

  async getPrice({ id }: UrlValidator): Promise<Prices> {
    try {
      this.logger.log(`Looking for price with id: ${id}`);
      const price = await this.priceModel.findById(id).populate('city').lean();
      if (!price) {
        this.logger.error(`Price with id: ${id} not found`);
        throw new NotFoundException(`Price with id: ${id} not found`);
      }
      return price;
    } catch (error) {
      this.logger.error(`Something went wrong while getting price: ${error}`);
      throw handleErrorsOnServices(
        'Something went wrong while getting price.',
        error,
      );
    }
  }

  async updatePrice(
    { id }: UrlValidator,
    updatePriceDTO: UpdatePriceDTO,
  ): Promise<Prices> {
    try {
      const price = await this.priceModel.findByIdAndUpdate(
        id,
        updatePriceDTO,
        { new: true },
      );
      if (!price) {
        this.logger.error(`Price with id: ${id} not found`);
        throw new NotFoundException(`Price with id: ${id} not found`);
      }
      return price;
    } catch (error) {
      this.logger.error(`Something went wrong while updating price: ${error}`);
      throw handleErrorsOnServices(
        'Something went wrong while updating price.',
        error,
      );
    }
  }

  async deletePrice({ id }: UrlValidator): Promise<void> {
    try {
      const price = await this.priceModel.findByIdAndDelete(id);
      if (!price) {
        this.logger.error(`Price with id: ${id} not found`);
        throw new NotFoundException(`Price with id: ${id} not found`);
      }
    } catch (error) {
      this.logger.error(`Something went wrong while deleting price: ${error}`);
      throw handleErrorsOnServices(
        'Something went wrong while deleting price.',
        error,
      );
    }
  }

  async reactivatePrice({ id }: UrlValidator): Promise<void> {
    try {
      const price = await this.priceModel.findByIdAndUpdate(
        id,
        { status: Status.ACTIVE },
        { new: true },
      );
      if (!price) {
        this.logger.error(`Price with id: ${id} not found`);
        throw new NotFoundException(`Price with id: ${id} not found`);
      }
    } catch (error) {
      this.logger.error(
        `Something went wrong while reactivating price: ${error}`,
      );
      throw handleErrorsOnServices(
        'Something went wrong while reactivating price.',
        error,
      );
    }
  }

  async getPricesByCity({ id }: UrlValidator): Promise<Prices[]> {
    try {
      this.logger.log(`Getting prices for city with id: ${id}`);
      const prices = await this.priceModel.find({ city: id }).lean();
      if (!prices.length) {
        this.logger.error('Prices for origin city not found');
        throw new NotFoundException('Prices for origin city not found');
      }
      return prices;
    } catch (error) {
      this.logger.error(
        `Something went wrong while getting prices for city: ${error}`,
      );
      throw handleErrorsOnServices(
        'Something went wrong while getting prices for city.',
        error,
      );
    }
  }
}
