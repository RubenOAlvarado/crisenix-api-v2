import { PipelineStage } from 'mongoose';
import { SearchableFields } from '../enums/searcher/destination/fields.enum';
import { SearchStrategy } from '../interfaces/search.strategy.interface';
import { SearcherDestinationDto } from '../models/dtos/searcher/destination/searcherDestination.dto';

export class DefaultDestinationSearcher
  implements SearchStrategy<SearcherDestinationDto>
{
  search({
    field = SearchableFields.NAME,
    word,
  }: SearcherDestinationDto): PipelineStage | PipelineStage[] {
    return field && field !== SearchableFields.CATEGORY && word
      ? {
          $match: {
            [field]: {
              $regex: word,
              $options: 'i',
            },
          },
        }
      : [
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
          {
            $match: {
              $or: [
                {
                  description: {
                    $regex: word,
                    $options: 'i',
                  },
                },
                {
                  code: {
                    $regex: word,
                    $options: 'i',
                  },
                },
                {
                  name: {
                    $regex: word,
                    $options: 'i',
                  },
                },
                {
                  'categories.label': {
                    $regex: word,
                    $options: 'i',
                  },
                },
              ],
            },
          },
        ];
  }
}
