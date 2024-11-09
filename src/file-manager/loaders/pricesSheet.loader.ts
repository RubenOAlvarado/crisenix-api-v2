import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseSheetLoader } from '../baseSheetLoader';
import { CreatePriceDTO } from '@/shared/models/dtos/request/price/createprice.dto';
import { PricesService } from '@/prices/prices.service';
import { CatalogSheetNames } from '@/shared/enums/file-manager/catalogsSheetNames.enum';
import { OriginCityService } from '@/origincity/origincity.service';
import { PricesExcel } from '@/shared/interfaces/excel/prices.excel.interface';
import { WorkSheet } from 'xlsx';
import { Currency } from '@/shared/enums/currency.enum';

@Injectable()
export class PricesSheetLoader extends BaseSheetLoader<CreatePriceDTO> {
  constructor(
    pricesService: PricesService,
    private readonly originCitiesService: OriginCityService,
  ) {
    super(pricesService, CatalogSheetNames.PRICES);
  }

  protected override async transformSheet(
    sheet: WorkSheet,
  ): Promise<CreatePriceDTO[]> {
    const pricesFromExcel = (await super.transformSheet(
      sheet,
    )) as PricesExcel[];
    return await this.transformPrices(pricesFromExcel);
  }

  private async transformPrices(
    pricesFromExcel: PricesExcel[],
  ): Promise<CreatePriceDTO[]> {
    const transformedPrices: CreatePriceDTO[] = [];
    for (const {
      ciudad,
      moneda,
      general,
      sencillo,
      doble,
      triple,
      cuadruple,
      menor,
      inapam,
    } of pricesFromExcel) {
      const originCity = await this.getOrCreateOriginCity(ciudad.trim());
      transformedPrices.push({
        originCity,
        currency: moneda.trim() as Currency,
        generalPrice: general,
        singleBasePrice: sencillo,
        doubleBasePrice: doble,
        tripleBasePrice: triple,
        quadrupleBasePrice: cuadruple,
        minorPrice: menor,
        inapamPrice: inapam,
      });
    }
    return transformedPrices;
  }

  async getOrCreateOriginCity(name: string): Promise<string> {
    const originCity = await this.originCitiesService.findByName(name);

    if (!originCity) {
      throw new BadRequestException(
        `Origin city with name ${name} not found in database.`,
      );
    }

    return originCity._id.toString();
  }
}
