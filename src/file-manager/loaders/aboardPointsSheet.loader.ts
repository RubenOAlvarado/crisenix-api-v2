/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { CreateAboardPointDTO } from '@/shared/models/dtos/request/aboardpoint/createaboardpoint.dto';
import { BaseSheetLoader } from '../baseSheetLoader';
import { AboardpointService } from '@/aboardpoint/aboardpoint.service';
import { OriginCityService } from '@/origincity/origincity.service';
import { CatalogSheetNames } from '@/shared/enums/file-manager/catalogsSheetNames.enum';
import { AboardPointExcel } from '@/shared/interfaces/excel/aboardPoint.excel.interface';
import { WorkSheet } from 'xlsx';

export class AboardPointsSheetLoader extends BaseSheetLoader<CreateAboardPointDTO> {
  constructor(
    aboardPointsService: AboardpointService,
    private originCityService: OriginCityService,
  ) {
    super(aboardPointsService, CatalogSheetNames.ABOARD_POINTS);
  }

  protected override async transformSheet(
    sheet: WorkSheet,
  ): Promise<CreateAboardPointDTO[]> {
    const aboardPointsFromExcel = (await super.transformSheet(
      sheet,
    )) as AboardPointExcel[];
    return await this.transformAboardPoints(aboardPointsFromExcel);
  }

  private async transformAboardPoints(
    aboardPointsFromExcel: AboardPointExcel[],
  ) {
    const transformedAboardPoints: CreateAboardPointDTO[] = [];
    for (const { nombre, ciudadDeOrigen } of aboardPointsFromExcel) {
      const originCity = await this.getOrCreateOriginCity(ciudadDeOrigen);
      transformedAboardPoints.push({
        name: nombre,
        originCity,
      });
    }
    return transformedAboardPoints;
  }

  async getOrCreateOriginCity(ciudadDeOrigen: string): Promise<string> {
    const [nombre, estado] = ciudadDeOrigen.split(',');
    const cleanedName = nombre?.trim();
    const cleanedState = estado?.trim();
    let originCity = await this.originCityService.findByName(cleanedName);
    if (!originCity) {
      originCity = await this.originCityService.create({
        name: cleanedName!,
        state: cleanedState!,
      });
      return originCity._id.toString();
    }
    return originCity._id.toString();
  }
}
