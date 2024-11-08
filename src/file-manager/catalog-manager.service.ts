import { SheetLoader } from '@/shared/interfaces/filemanager/sheetLoader.interface';
import { Injectable } from '@nestjs/common';
import { TransportSheetLoader } from './loaders/transportSheet.loader';
import { readFile, WorkBook } from 'xlsx';
import { handleErrorsOnServices } from '@/shared/utilities/helpers';
import { CatalogSheetNames } from '@/shared/enums/file-manager/catalogsSheetNames.enum';
import { TourTypeSheetLoader } from './loaders/tourTypeSheet.loader';
import { AboardPointsSheetLoader } from './loaders/aboardPointsSheet.loader';

@Injectable()
export class CatalogManagerService {
  private readonly independentLoaders: SheetLoader[];
  private readonly dependentLoaders: SheetLoader[];

  constructor(
    transportLoader: TransportSheetLoader,
    tourTypeLoader: TourTypeSheetLoader,
    aboardPointsLoader: AboardPointsSheetLoader,
  ) {
    this.independentLoaders = [
      transportLoader,
      tourTypeLoader,
      aboardPointsLoader,
    ];
    this.dependentLoaders = [];
  }

  async loadCatalogs(filePath: string): Promise<void> {
    try {
      const workbook: WorkBook = readFile(filePath);
      const sheetNames = workbook.SheetNames;
      this.validateSheetNames(sheetNames);

      // Load independent loaders first
      await Promise.all(
        this.independentLoaders.map((loader) =>
          loader.loadSheet(workbook, sheetNames),
        ),
      );

      // Load dependent loaders
      await Promise.all(
        this.dependentLoaders.map((loader) =>
          loader.loadSheet(workbook, sheetNames),
        ),
      );
    } catch (error) {
      throw handleErrorsOnServices('Error loading catalogs.', error);
    }
  }

  private validateSheetNames(sheetNames: string[]): void {
    const validSheets = Object.values(CatalogSheetNames);
    const missingSheets = validSheets.filter(
      (sheet) => !sheetNames.includes(sheet),
    );

    if (missingSheets.length > 0) {
      throw new Error(`Missing sheets: ${missingSheets.join(', ')}.`);
    }
  }
}
