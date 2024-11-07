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
