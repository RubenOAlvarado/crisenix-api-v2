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

@Injectable()
export class FileManagerService {
  constructor(
    private destinationService: DestinationService,
    private tourService: TourService,
  ) {}

  validSheetName = ['Destinos', 'Tours'];
  services: { [key: string]: (jsonObject: any) => Promise<void> } = {
    Destinos: this.destinationService.insertDestinationsBunch.bind(
      this.destinationService,
    ),
    Tours: this.tourService.insertToursBunch.bind(this.tourService),
  };

  async loadToursAndDestinations(filePath: string): Promise<void> {
    try {
      const workbook: WorkBook = readFile(filePath);
      const sheetNames = workbook.SheetNames;
      validateSheetNames(sheetNames, this.validSheetName);
      await Promise.all([
        this.loadDestinationDocument(sheetNames, workbook),
        this.loadTourDocument(sheetNames, workbook),
      ]);
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
}
