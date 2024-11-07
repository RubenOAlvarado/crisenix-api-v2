import { WorkBook } from 'xlsx';

export interface SheetLoader {
  loadSheet(workBook: WorkBook, sheetNames: string[]): Promise<void>;
}
