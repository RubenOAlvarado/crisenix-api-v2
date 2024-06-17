import { DestinationService } from '@/destination/destination.service';
import { OriginCityService } from '@/origincity/origincity.service';
import { Currency } from '@/shared/enums/currency.enum';
import { PricesExcel } from '@/shared/interfaces/excel/prices.excel.interface';
import { CreatePriceDTO } from '@/shared/models/dtos/request/price/createprice.dto';
import { CreateTourPriceDTO } from '@/shared/models/dtos/request/price/createtourprice.dto';
import { Prices } from '@/shared/models/schemas/price.schema';
import { handleErrorsOnServices } from '@/shared/utilities/helpers';
import { Injectable } from '@nestjs/common';
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
      return mappedDTO;
    } catch (error) {
      throw handleErrorsOnServices('Error mapping prices.', error);
    }
  }

  async validateFromTourExcel(price: string): Promise<CreateTourPriceDTO[]> {
    try {
      const mappedPrices: CreateTourPriceDTO[] = [];
      const prices = price.split(',');
      for (const price of prices) {
        const [destination, city] = price.split('-');
        const destinationId =
          await this.destinationService.validateFromTourExcel(destination);
        const cityId = await this.originCityService.validateFromPriceExcel(
          city,
        );
        const priceExists = await this.priceModel.findOne({
          destination: destinationId,
          city: cityId,
        });
        if (!priceExists) {
          throw new Error('Price not found.');
        }
        mappedPrices.push({
          currency: priceExists.currency as Currency,
          general: priceExists.general,
          singleBase: priceExists.singleBase,
          doubleBase: priceExists.doubleBase,
          tripleBase: priceExists.tripleBase,
          quadrupleBase: priceExists.quadrupleBase,
          minor: priceExists.minor,
          inapam: priceExists.inapam,
        });
      }
      return mappedPrices;
    } catch (error) {
      throw handleErrorsOnServices('Error validating price.', error);
    }
  }
}
