import { TourCatalogs } from '../enums/tour/catalogs.enum';
import { CatalogQuery } from '../interfaces/catalogQuery.interface';

export class PricesQuery implements CatalogQuery {
  createQuery() {
    return { path: TourCatalogs.PRICES, model: 'Prices' };
  }
}
