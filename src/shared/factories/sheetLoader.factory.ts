import { CatalogSheetNames } from '../enums/file-manager/catalogsSheetNames.enum';
import { SheetLoader } from '../interfaces/filemanager/sheetLoader.interface';

export abstract class SheetLoaderFactory {
  abstract createLoader(sheetNames: CatalogSheetNames): SheetLoader;
}
