export interface GenericCatalogService<T> {
  insertBunch(jsonObject: T[]): Promise<void>;
}
