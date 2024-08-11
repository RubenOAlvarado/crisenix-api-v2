import { DestinationService } from '@/destination/destination.service';
import { OriginCityService } from '@/origincity/origincity.service';
import { Currency } from '@/shared/enums/currency.enum';
import { Status } from '@/shared/enums/status.enum';
import { PricesExcel } from '@/shared/interfaces/excel/prices.excel.interface';
import { CreatePriceDTO } from '@/shared/models/dtos/request/price/createprice.dto';
import { UpdatePriceDTO } from '@/shared/models/dtos/request/price/updateprice.dto';
import { Prices } from '@/shared/models/schemas/price.schema';
import { handleErrorsOnServices } from '@/shared/utilities/helpers';
import { UrlValidator } from '@/shared/validators/urlValidator.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class PricesService {
  constructor(
    @InjectModel(Prices.name)
    private readonly priceModel: Model<Prices>,
    private readonly destinationService: DestinationService,
    private readonly originCityService: OriginCityService,
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

  async getPrices(query: any): Promise<Prices[]> {
    try {
      const prices = await this.priceModel.find(query).exec();
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
    { id }: UrlValidator,
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

  async getPriceById(params: any): Promise<Prices> {
    try {
      const price = await this.priceModel.findById(params.id).exec();
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

  async inactivatePrice({ id }: UrlValidator): Promise<void> {
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

  async reactivatePrice({ id }: UrlValidator): Promise<void> {
    try {
      await this.priceModel
        .findByIdAndUpdate(id, { status: Status.ACTIVE }, { new: true })
        .exec();
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong while reactivating price.',
        error,
      );
    }
  }

  async insertPricesBunch(prices: PricesExcel[]): Promise<void> {
    try {
      const pricesDTO: CreatePriceDTO[] = await this.mapDTO(prices);
      await this.priceModel.insertMany(pricesDTO);
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong while inserting categories.',
        error,
      );
    }
  }

  private async mapDTO(prices: PricesExcel[]): Promise<CreatePriceDTO[]> {
    try {
      const mappedDTO: CreatePriceDTO[] = [];
      for (const {
        destino,
        ciudad,
        moneda,
        general,
        sencillo,
        doble,
        triple,
        cuadruple,
        menor,
        inapam,
      } of prices) {
        const destination = await this.destinationService.validateFromTourExcel(
          destino,
        );
        const city = await this.originCityService.validateFromPriceExcel(
          ciudad,
        );
        const dto: CreatePriceDTO = {
          destination,
          city,
          currency: moneda as Currency,
          general,
          singleBase: sencillo,
          doubleBase: doble,
          tripleBase: triple,
          quadrupleBase: cuadruple,
          minor: menor,
          inapam,
        };
        mappedDTO.push(dto);
      }
      return Promise.all(mappedDTO);
    } catch (error) {
      throw handleErrorsOnServices('Error mapping prices.', error);
    }
  }

  async validateFromTourExcel(price: string): Promise<string[]> {
    try {
      const mappedPrices: string[] = [];
      const prices = price.split(',');
      for (const price of prices) {
        const [destination, city] = price.split('-');
        const destinationId =
          await this.destinationService.validateFromTourExcel(
            destination?.trim(),
          );
        const cityId = await this.originCityService.validateFromPriceExcel(
          city?.trim(),
        );
        const priceExists = await this.priceModel
          .findOne({
            destination: destinationId,
            city: cityId,
          })
          .exec();
        if (!priceExists) {
          throw new Error('Price not found.');
        }
        mappedPrices.push(priceExists?._id?.toString());
      }
      return mappedPrices;
    } catch (error) {
      throw handleErrorsOnServices('Error validating price.', error);
    }
  }
}
