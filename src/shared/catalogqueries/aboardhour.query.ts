import { CatalogQuery } from '../interfaces/catalogQuery.interface';

export class AboardHourQuery implements CatalogQuery {
  createQuery() {
    return { path: 'aboardHour.aboardPoint', model: 'AboardPoints' };
  }
}
