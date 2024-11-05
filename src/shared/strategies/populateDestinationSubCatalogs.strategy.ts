import { PipelineStage } from 'mongoose';
import { SearchStrategy } from '../interfaces/search.strategy.interface';

export class PopulateSubcatalogsStrategy
  implements SearchStrategy<{ shouldPopulate?: boolean }>
{
  search({ shouldPopulate }: { shouldPopulate?: boolean }): PipelineStage[] {
    return shouldPopulate
      ? [
          {
            $lookup: {
              from: 'origincities',
              localField: 'originCities',
              foreignField: '_id',
              as: 'originCities',
            },
          },
          {
            $unwind: {
              path: '$originCities',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: 'transferTypes',
              localField: 'transferTypes',
              foreignField: '_id',
              as: 'transferTypes',
            },
          },
          {
            $unwind: {
              path: '$transferTypes',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: 'categories',
              localField: 'categories',
              foreignField: '_id',
              as: 'categories',
            },
          },
          {
            $unwind: {
              path: '$categories',
              preserveNullAndEmptyArrays: true,
            },
          },
        ]
      : [];
  }
}
