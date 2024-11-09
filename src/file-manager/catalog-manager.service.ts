import { SheetLoader } from '@/shared/interfaces/filemanager/sheetLoader.interface';
import { Injectable } from '@nestjs/common';
import { TransportSheetLoader } from './loaders/transportSheet.loader';
import { readFile, WorkBook } from 'xlsx';
import { handleErrorsOnServices } from '@/shared/utilities/helpers';
import { CatalogSheetNames } from '@/shared/enums/file-manager/catalogsSheetNames.enum';
import { TourTypeSheetLoader } from './loaders/tourTypeSheet.loader';
import { AboardPointsSheetLoader } from './loaders/aboardPointsSheet.loader';
import { DestinationSheetLoader } from './loaders/destinationSheet.loader';
import { CategorySheetLoader } from './loaders/categorySheet.loader';
import { IncludedServicesSheetLoader } from './loaders/includedServices.loader';
import { PricesSheetLoader } from './loaders/pricesSheet.loader';
import { ClassificationsSheetLoader } from './loaders/classificationsSheet.loader';
import { RolesSheetLoader } from './loaders/rolesSheet.loader';
import { ToursSheetLoader } from './loaders/toursSheet.loader';

@Injectable()
export class CatalogManagerService {
  private readonly independentLoaders: SheetLoader[];
  private readonly dependentLoaders: SheetLoader[];

  constructor(
    transportLoader: TransportSheetLoader,
    tourTypeLoader: TourTypeSheetLoader,
    aboardPointsLoader: AboardPointsSheetLoader,
    categoriesLoader: CategorySheetLoader,
    destinationsLoader: DestinationSheetLoader,
    includedServicesLoader: IncludedServicesSheetLoader,
    pricesLoader: PricesSheetLoader,
    classificationsLoader: ClassificationsSheetLoader,
    rolesLoader: RolesSheetLoader,
    private toursLoader: ToursSheetLoader,
  ) {
    this.independentLoaders = [
      transportLoader,
      tourTypeLoader,
      aboardPointsLoader,
      categoriesLoader,
      includedServicesLoader,
      classificationsLoader,
      rolesLoader,
    ];
    this.dependentLoaders = [destinationsLoader, pricesLoader];
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

      // finally load tours
      await this.toursLoader.loadSheet(workbook, sheetNames);
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
