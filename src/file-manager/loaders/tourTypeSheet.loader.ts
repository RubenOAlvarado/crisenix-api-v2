import { CatalogSheetNames } from '@/shared/enums/file-manager/catalogsSheetNames.enum';
import { TourtypeService } from '@/tourtype/tourtype.service';
import { BaseSheetLoader } from '../baseSheetLoader';
import { Injectable } from '@nestjs/common';
import { CreateTourTypeDTO } from '@/shared/models/dtos/request/tourType/createTourType.dto';
import { TourTypeExcel } from '@/shared/interfaces/excel/tourType.excel.interface';
import { WorkSheet } from 'xlsx';

@Injectable()
export class TourTypeSheetLoader extends BaseSheetLoader<CreateTourTypeDTO> {
  constructor(tourTypeService: TourtypeService) {
    super(tourTypeService, CatalogSheetNames.TOUR_TYPE);
  }

  protected override async transformSheet(
    sheet: WorkSheet,
  ): Promise<CreateTourTypeDTO[]> {
    const tourTypesFromExcel = (await super.transformSheet(
      sheet,
    )) as TourTypeExcel[];
    return await this.transformTourTypes(tourTypesFromExcel);
  }

  private async transformTourTypes(tourTypesFromExcel: TourTypeExcel[]) {
    const transformedTourTypes: CreateTourTypeDTO[] = [];
    for (const { nombre, descripcion } of tourTypesFromExcel) {
      transformedTourTypes.push({
        name: nombre,
        description: descripcion,
      });
    }
    return transformedTourTypes;
  }
}
