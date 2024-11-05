export type PopulateConfig = {
  path: string;
  populate?: PopulateConfig;
  select?: Record<string, number>;
};
