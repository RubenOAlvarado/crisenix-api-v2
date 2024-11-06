/*
import { TransportsService } from '@/transports/transports.service';
import { Injectable } from '@nestjs/common';
import { WorkBook, readFile } from 'xlsx';
import {
  loadDocument,
  transformSheet,
  validateSheetNames,
} from './file-manager.utils';
import { handleErrorsOnServices } from '@/shared/utilities/helpers';
import { TourtypeService } from '@/tourtype/tourtype.service';
import { OriginCityService } from '@/origincity/origincity.service';
import { AboardpointService } from '@/aboardpoint/aboardpoint.service';
import { CategoryService } from '@/category/category.service';
import { TransfertypeService } from '@/transfertype/transfertype.service';

@Injectable()
export class CatalogManagerService {
  constructor(
    private transportService: TransportsService,
    private tourTypeService: TourtypeService,
    private originCityService: OriginCityService,
    private aboardPointService: AboardpointService,
    private categoryService: CategoryService,
    private transfertypeService: TransfertypeService,
  ) {}

  validSheetName = [
    'Transportes',
    'TipoDeTour',
    'CiudadesDeOrigen',
    'PuntosDeAscenso',
    'Categorías',
    'TipoDeTraslado',
  ];
  services: { [key: string]: (jsonObject: any) => Promise<void> } = {
    Transportes: this.transportService.insertTransportsBunch.bind(
      this.transportService,
    ),
    TipoDeTour: this.tourTypeService.insertTourTypeBunch.bind(
      this.tourTypeService,
    ),
    CiudadesDeOrigen: this.originCityService.insertOriginCityBunch.bind(
      this.originCityService,
    ),
    PuntosDeAscenso: this.aboardPointService.insertAboardPointBunch.bind(
      this.aboardPointService,
    ),
    Categorías: this.categoryService.insertCategoriesBunch.bind(
      this.categoryService,
    ),
    TipoDeTraslado: this.transfertypeService.insertTransferTypesBunch.bind(
      this.transfertypeService,
    ),
  };

  async loadCatalogs(filePath: string): Promise<void> {
    try {
      const workbook: WorkBook = readFile(filePath);
      const sheetNames = workbook.SheetNames;
      validateSheetNames(sheetNames, this.validSheetName);
      // first we load non dependant documents
      await Promise.all([
        this.loadTourTypeDocument(sheetNames, workbook),
        this.loadAboardPointDocument(sheetNames, workbook),
        this.loadCategories(sheetNames, workbook),
        this.loadTransferTypeDocument(sheetNames, workbook),
      ]);
      // then we load dependant documents
      await Promise.all([
        this.loadTransportsDocument(sheetNames, workbook),
        this.loadOriginCityDocument(sheetNames, workbook),
      ]);
    } catch (error) {
      throw handleErrorsOnServices('Error loading catalogs.', error);
    }
  }

  private async loadTransportsDocument(
    sheetNames: string[],
    workBook: WorkBook,
  ): Promise<void> {
    try {
      const name = 'Transportes';
      const transportSheetName = sheetNames.find(
        (sheetName) => sheetName === name,
      );
      const transportSheet = workBook.Sheets[transportSheetName!];
      const transportSheetData = transformSheet(transportSheet);
      await loadDocument(transportSheetData, name, this.services);
    } catch (error) {
      throw handleErrorsOnServices('Error loading transports.', error);
    }
  }

  private async loadTourTypeDocument(
    sheetNames: string[],
    workBook: WorkBook,
  ): Promise<void> {
    try {
      const name = 'TipoDeTour';
      const tourTypeSheetName = sheetNames.find(
        (sheetName) => sheetName === name,
      );
      const tourTypeSheet = workBook.Sheets[tourTypeSheetName!];
      const tourTypeSheetData = transformSheet(tourTypeSheet);
      await loadDocument(tourTypeSheetData, name, this.services);
    } catch (error) {
      throw handleErrorsOnServices('Error loading tour types.', error);
    }
  }

  private async loadOriginCityDocument(
    sheetNames: string[],
    workBook: WorkBook,
  ): Promise<void> {
    try {
      const name = 'CiudadesDeOrigen';
      const originCitySheetName = sheetNames.find(
        (sheetName) => sheetName === name,
      );
      const originCitySheet = workBook.Sheets[originCitySheetName!];
      const originCitySheetData = transformSheet(originCitySheet);
      await loadDocument(originCitySheetData, name, this.services);
    } catch (error) {
      throw handleErrorsOnServices('Error loading origin cities.', error);
    }
  }

  private async loadAboardPointDocument(
    sheetNames: string[],
    workBook: WorkBook,
  ): Promise<void> {
    try {
      const name = 'PuntosDeAscenso';
      const aboardPointSheetName = sheetNames.find(
        (sheetName) => sheetName === name,
      );
      const aboardPointSheet = workBook.Sheets[aboardPointSheetName!];
      const aboardPointSheetData = transformSheet(aboardPointSheet);
      await loadDocument(aboardPointSheetData, name, this.services);
    } catch (error) {
      throw handleErrorsOnServices('Error loading aboard points.', error);
    }
  }

  private async loadCategories(
    sheetNames: string[],
    workBook: WorkBook,
  ): Promise<void> {
    try {
      const name = 'Categorías';
      const categorySheetName = sheetNames.find(
        (sheetName) => sheetName === name,
      );
      const categorySheet = workBook.Sheets[categorySheetName!];
      const categorySheetData = transformSheet(categorySheet);
      await loadDocument(categorySheetData, name, this.services);
    } catch (error) {
      throw handleErrorsOnServices('Error loading categories.', error);
    }
  }

  private async loadTransferTypeDocument(
    sheetNames: string[],
    workBook: WorkBook,
  ): Promise<void> {
    try {
      const name = 'TipoDeTraslado';
      const transferTypeSheetName = sheetNames.find(
        (sheetName) => sheetName === name,
      );
      const transferTypeSheet = workBook.Sheets[transferTypeSheetName!];
      const transferTypeSheetData = transformSheet(transferTypeSheet);
      await loadDocument(transferTypeSheetData, name, this.services);
    } catch (error) {
      throw handleErrorsOnServices('Error loading transfer types.', error);
    }
  }
}
 */
