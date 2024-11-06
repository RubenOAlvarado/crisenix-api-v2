import { TourCatalogs } from '../enums/tour/catalogs.enum';
import { CatalogQuery } from '../interfaces/catalogQuery.interface';

export class IncludedQuery implements CatalogQuery {
  createQuery() {
    return {
      path: TourCatalogs.INCLUDEDSERVICES,
      populate: {
        path: 'included',
        model: 'Includeds',
        populate: { path: 'entry', model: 'Entries' },
      },
    };
  }
}
