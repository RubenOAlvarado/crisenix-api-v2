/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { DestinationService } from '@/destination/destination.service';
import { handleErrorsOnServices } from '@/shared/utilities/helpers';
import { TourService } from '@/tour/tour.service';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
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
  private logger = new Logger(FileManagerService.name);

  private isValidSheetName(names: string[]): boolean {
    return names.every((name) => this.validSheetName.includes(name));
  }

  async loadCatalogs(filePath: string): Promise<void> {
    try {
      const workbook: WorkBook = readFile(filePath);
      const sheetNames = workbook.SheetNames;
      if (!this.isValidSheetName(sheetNames))
        throw new BadRequestException('Invalid sheet name.');
      const destinationSheetName = sheetNames.find(
        (sheetName) => sheetName === 'Destinos',
      );
      this.logger.debug('Sheet name: ' + destinationSheetName);
      //const tourSheet = sheetNames.find((sheetName) => sheetName === 'Tours');
      const destinationSheet = workbook.Sheets[destinationSheetName!];
      const destinationSheetData = this.transformSheet(destinationSheet);
      this.logger.debug('Sheet data: ' + !!destinationSheetData);
      //const tourSheetData = this.transformSheet(workbook.Sheets[tourSheet!]);
      await this.loadDocument(destinationSheetData, 'Destinos');
      //await this.loadDocument(tourSheetData, 'Tours');
    } catch (error) {
      throw handleErrorsOnServices('Error loading catalogs.', error);
    }
  }

  transformSheet(sheet: WorkSheet | undefined): any {
    return sheet_to_json(sheet!);
  }

  async loadDocument(jsonObject: any, name: string): Promise<void> {
    try {
      this.logger.debug('Loading document: ' + name);
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
      throw handleErrorsOnServices(`Error loading ${name}.`, error);
    }
  }
}
