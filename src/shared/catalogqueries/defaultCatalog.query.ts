import { CatalogQuery } from '../interfaces/catalogQuery.interface';

export class DefaultCatalogQuery implements CatalogQuery {
  private catalog: string;

  constructor(catalog: string) {
    this.catalog = catalog;
  }

  createQuery() {
    return { path: this.catalog };
  }
}
