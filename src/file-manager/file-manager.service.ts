/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { DestinationService } from '@/destination/destination.service';
import { handleErrorsOnServices } from '@/shared/utilities/helpers';
import { TourService } from '@/tour/tour.service';
import { Injectable } from '@nestjs/common';
import { WorkBook, readFile } from 'xlsx';
import {
  loadDocument,
  transformSheet,
  validateSheetNames,
} from './file-manager.utils';
import { PricesService } from '@/prices/prices.service';

@Injectable()
export class FileManagerService {
  constructor(
    private destinationService: DestinationService,
    private tourService: TourService,
    private priceService: PricesService,
  ) {}

  validSheetName = ['Destinos', 'Tours', 'Precios'];
  services: { [key: string]: (jsonObject: any) => Promise<void> } = {
    Destinos: this.destinationService.insertDestinationsBunch.bind(
      this.destinationService,
    ),
    Tours: this.tourService.insertToursBunch.bind(this.tourService),
    Precios: this.priceService.insertPricesBunch.bind(this.priceService),
  };

  async loadToursAndDestinations(filePath: string): Promise<void> {
    try {
      const workbook: WorkBook = readFile(filePath);
      const sheetNames = workbook.SheetNames;
      validateSheetNames(sheetNames, this.validSheetName);
      // first load destinations
      await this.loadDestinationDocument(sheetNames, workbook);

      // then load prices
      await this.loadPriceDocument(sheetNames, workbook);

      // finally load tours
      await this.loadTourDocument(sheetNames, workbook);
    } catch (error) {
      throw handleErrorsOnServices('Error loading catalogs.', error);
    }
  }

  private async loadDestinationDocument(
    sheetNames: string[],
    workBook: WorkBook,
  ): Promise<void> {
    const name = 'Destinos';
    const destinationSheetName = sheetNames.find(
      (sheetName) => sheetName === name,
    );
    const destinationSheet = workBook.Sheets[destinationSheetName!];
    const destinationSheetData = transformSheet(destinationSheet);
    await loadDocument(destinationSheetData, name, this.services);
  }

  private async loadTourDocument(
    sheetNames: string[],
    workBook: WorkBook,
  ): Promise<void> {
    const name = 'Tours';
    const tourSheetName = sheetNames.find((sheetName) => sheetName === name);
    const tourSheet = workBook.Sheets[tourSheetName!];
    const tourSheetData = transformSheet(tourSheet);
    await loadDocument(tourSheetData, name, this.services);
  }

  private async loadPriceDocument(
    sheetNames: string[],
    workBook: WorkBook,
  ): Promise<void> {
    const name = 'Precios';
    const priceSheetName = sheetNames.find((sheetName) => sheetName === name);
    const priceSheet = workBook.Sheets[priceSheetName!];
    const priceSheetData = transformSheet(priceSheet);
    await loadDocument(priceSheetData, name, this.services);
  }
}
