import { GenericCatalogService } from '@/shared/interfaces/filemanager/genericCatalog.service.interface';
import { SheetLoader } from '../shared/interfaces/filemanager/sheetLoader.interface';
import { handleErrorsOnServices } from '@/shared/utilities/helpers';
import { WorkBook, WorkSheet, utils } from 'xlsx';

export abstract class BaseSheetLoader<T> implements SheetLoader {
  constructor(
    protected readonly service: GenericCatalogService<T>,
    protected readonly sheetName: string,
  ) {}

  async loadSheet(workBook: WorkBook, sheetNames: string[]): Promise<void> {
    try {
      const targetSheet = sheetNames.find((sheet) => sheet === this.sheetName);
      if (!targetSheet) {
        throw new Error(`Sheet ${this.sheetName} not found in the workbook.`);
      }

      const sheet = workBook.Sheets[targetSheet];
      if (!sheet) {
        throw new Error(`Sheet ${targetSheet} is null or undefined.`);
      }
      const sheetData = this.transformSheet(sheet);
      await this.service.insertBunch(sheetData);
    } catch (error) {
      throw handleErrorsOnServices(`Error loading ${this.sheetName}.`, error);
    }
  }

  protected transformSheet(sheet: WorkSheet): T[] {
    if (!sheet) {
      throw new Error('Sheet is null or undefined.');
    }
    return utils.sheet_to_json(sheet);
  }
}
