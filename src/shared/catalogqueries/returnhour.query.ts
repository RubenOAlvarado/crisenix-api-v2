import { CatalogQuery } from '../interfaces/catalogQuery.interface';

export class ReturnHourQuery implements CatalogQuery {
  createQuery() {
    return { path: 'returnHour.aboardPoint', model: 'AboardPoints' };
  }
}
