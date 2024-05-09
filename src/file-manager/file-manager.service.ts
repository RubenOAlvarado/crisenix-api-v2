/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { DestinationService } from '@/destination/destination.service';
import { handleErrorsOnServices } from '@/shared/utilities/helpers';
import { TourService } from '@/tour/tour.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { WorkBook, WorkSheet, readFile, utils } from 'xlsx';
const { sheet_to_json } = utils;

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

  private isValidSheetName(names: string[]): boolean {
    return names.every((name) => this.validSheetName.includes(name));
  }

  async loadCatalogs(filePath: string): Promise<void> {
    try {
      const workbook: WorkBook = readFile(filePath);
      const sheetNames = workbook.SheetNames;
      if (!this.isValidSheetName(sheetNames))
        throw new BadRequestException('Invalid sheet name.');
      await this.loadDestinationDocument(sheetNames, workbook);
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
    const destinationSheetData = this.transformSheet(destinationSheet);
    await this.loadDocument(destinationSheetData, name);
  }

  private async loadTourDocument(
    sheetNames: string[],
    workBook: WorkBook,
  ): Promise<void> {
    const name = 'Tours';
    const tourSheetName = sheetNames.find((sheetName) => sheetName === name);
    const tourSheet = workBook.Sheets[tourSheetName!];
    const tourSheetData = this.transformSheet(tourSheet);
    await this.loadDocument(tourSheetData, name);
  }

  transformSheet(sheet: WorkSheet | undefined): any {
    return sheet_to_json(sheet!);
  }

  async loadDocument(jsonObject: any, name: string): Promise<void> {
    try {
      if (this.services[name]) {
        const serviceFunction = this.services[name];
        if (typeof serviceFunction === 'function') {
          return await serviceFunction(jsonObject);
        } else {
          throw new BadRequestException('Invalid service function.');
        }
      } else {
        throw new BadRequestException('Invalid service name.');
      }
    } catch (error) {
      throw handleErrorsOnServices(`Error loading ${name} document.`, error);
    }
  }
}
