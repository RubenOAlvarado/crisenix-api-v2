import { PipelineStage } from 'mongoose';
import { SearcherDTO } from '../enums/searcher/destination/searcher.dto';
import { SearchStrategy } from '../interfaces/search.strategy.interface';

export class SearchDestinationByCategory
  implements SearchStrategy<SearcherDTO>
{
  search({ word }: SearcherDTO): PipelineStage[] {
    return word
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
            $unwind: { path: '$categories', preserveNullAndEmptyArrays: true },
          },
          { $match: { 'categories.label': { $regex: word, $options: 'i' } } },
        ]
      : [];
  }
}
