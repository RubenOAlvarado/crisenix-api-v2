import { Status } from '@/shared/enums/status.enum';
import { PricesExcel } from '@/shared/interfaces/excel/prices.excel.interface';
import { CreatePriceDTO } from '@/shared/models/dtos/request/price/createprice.dto';
import { UpdatePriceDTO } from '@/shared/models/dtos/request/price/updateprice.dto';
import { Prices } from '@/shared/models/schemas/price.schema';
import { handleErrorsOnServices } from '@/shared/utilities/helpers';
import { IdValidator } from '@/shared/models/dtos/validators/id.validator';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class PricesService {
  constructor(
    @InjectModel(Prices.name)
    private readonly priceModel: Model<Prices>,
  ) {}

  async createPrice(createPriceDTO: CreatePriceDTO): Promise<Prices> {
    try {
      const createdPrice = new this.priceModel(createPriceDTO);
      return await createdPrice.save();
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong while creating price.',
        error,
      );
    }
  }

  async getPrices(): Promise<Prices[]> {
    try {
      const prices = await this.priceModel
        .find()
        .select({ __v: 0, createdAt: 0 })
        .exec();
      if (!prices) {
        throw new NotFoundException('No prices registered.');
      }
      return prices;
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong while looking for prices.',
        error,
      );
    }
  }

  async updatePrice(
    { id }: IdValidator,
    updatePriceDTO: UpdatePriceDTO,
  ): Promise<Prices> {
    try {
      const updatedPrice = await this.priceModel
        .findByIdAndUpdate(id, updatePriceDTO, { new: true })
        .exec();
      if (!updatedPrice) {
        throw new NotFoundException('Price not found.');
      }
      return updatedPrice;
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong while updating price.',
        error,
      );
    }
  }

  async getPriceById({ id }: IdValidator): Promise<Prices> {
    try {
      const price = await this.priceModel.findById(id).exec();
      if (!price) {
        throw new NotFoundException('Price not found.');
      }
      return price;
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong while looking for price.',
        error,
      );
    }
  }

  async inactivatePrice({ id }: IdValidator): Promise<void> {
    try {
      await this.priceModel
        .findByIdAndUpdate(id, { status: Status.INACTIVE }, { new: true })
        .exec();
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong while inactivating price.',
        error,
      );
    }
  }

  async insertPricesBunch(prices: PricesExcel[]): Promise<void> {
    try {
      // const pricesDTO: CreatePriceDTO[] = await this.mapDTO(prices);
      await this.priceModel.insertMany(prices);
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong while inserting categories.',
        error,
      );
    }
  }
}
