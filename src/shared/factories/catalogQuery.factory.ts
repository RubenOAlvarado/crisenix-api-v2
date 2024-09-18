import { AboardHourQuery } from '../catalogqueries/aboardhour.query';
import { DefaultCatalogQuery } from '../catalogqueries/defaultCatalog.query';
import { IncludedQuery } from '../catalogqueries/included.query';
import { ItineraryQuery } from '../catalogqueries/itinerary.query';
import { PricesQuery } from '../catalogqueries/prices.query';
import { ReturnHourQuery } from '../catalogqueries/returnhour.query';
import { TourCatalogs } from '../enums/tour/catalogs.enum';
import { CatalogQuery } from '../interfaces/catalogQuery.interface';

export class CatalogQueryFactory {
  static createQuery(catalog: string): CatalogQuery {
    switch (catalog) {
      case TourCatalogs.RETURNHOUR:
        return new ReturnHourQuery();
      case TourCatalogs.ABOARDHOUR:
        return new AboardHourQuery();
      case TourCatalogs.ITINERARY:
        return new ItineraryQuery();
      case TourCatalogs.PRICES:
        return new PricesQuery();
      case TourCatalogs.INCLUDED:
        return new IncludedQuery();
      default:
        return new DefaultCatalogQuery(catalog);
    }
  }
}
