export interface PaginateResult<T> {
  docs: T[];
  totalDocs: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  page: number;
  totalPages: number;
}
