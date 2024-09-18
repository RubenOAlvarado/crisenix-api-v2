import { TourCatalogs } from '../enums/tour/catalogs.enum';
import { CatalogQuery } from '../interfaces/catalogQuery.interface';

export class ItineraryQuery implements CatalogQuery {
  createQuery() {
    return {
      path: TourCatalogs.ITINERARY,
      populate: { path: 'clasification', model: 'Clasifications' },
    };
  }
}
