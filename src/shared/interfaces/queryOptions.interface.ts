export interface CustomQueryOptions {
  page?: number;
  limit?: number;
  status?: string;
  shouldPopulate?: boolean;
  filter: Record<string, any>;
  sort?: Record<string, any>;
}
