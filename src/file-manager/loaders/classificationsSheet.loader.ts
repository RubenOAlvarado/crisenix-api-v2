import { CreateClassificationDTO } from '@/shared/models/dtos/request/classification/createclassification.dto';
import { BaseSheetLoader } from '../baseSheetLoader';
import { ClassificationService } from '@/classification/classification.service';
import { CatalogSheetNames } from '@/shared/enums/file-manager/catalogsSheetNames.enum';
import { Injectable } from '@nestjs/common';
import { WorkSheet } from 'xlsx';
import { ClassificationExcel } from '@/shared/interfaces/excel/classifications.excel.interface';

@Injectable()
export class ClassificationsSheetLoader extends BaseSheetLoader<CreateClassificationDTO> {
  constructor(classificationService: ClassificationService) {
    super(classificationService, CatalogSheetNames.CLASSIFICATIONS);
  }

  protected override async transformSheet(
    sheet: WorkSheet,
  ): Promise<CreateClassificationDTO[]> {
    const classificationsFromExcel = (await super.transformSheet(
      sheet,
    )) as ClassificationExcel[];
    return await this.transformClassifications(classificationsFromExcel);
  }

  private async transformClassifications(
    classificationsFromExcel: ClassificationExcel[],
  ): Promise<CreateClassificationDTO[]> {
    const transformedClassifications: CreateClassificationDTO[] = [];

    for (const { nombre } of classificationsFromExcel) {
      transformedClassifications.push({
        name: nombre,
      });
    }

    return transformedClassifications;
  }
}
