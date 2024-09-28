import { PipelineStage } from 'mongoose';
import { SearchStrategy } from '../interfaces/search.strategy.interface';
import { SearcherDestinationDto } from '../dtos/searcher/destination/searcherDestination.dto';

export class SearchDestinationByCategory
  implements SearchStrategy<SearcherDestinationDto>
{
  search({ word }: SearcherDestinationDto): PipelineStage[] {
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
