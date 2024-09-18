import { PipelineStage } from 'mongoose';
import { SearcherTourDTO } from '../enums/searcher/tour/searcher.dto';
import { SearchStrategy } from '../interfaces/search.strategy.interface';
import { SearchableTourFields } from '../enums/searcher/tour/fields.enum';

export class SearchTourByDestinationCategory
  implements SearchStrategy<SearcherTourDTO>
{
  search({ field, word }: SearcherTourDTO): PipelineStage[] {
    if (field === SearchableTourFields.DCATEGORY) {
      return [
        {
          $lookup: {
            from: 'destinations',
            localField: 'destination',
            foreignField: '_id',
            as: 'destination',
          },
        },
        {
          $unwind: { path: '$destination', preserveNullAndEmptyArrays: true },
        },
        {
          $lookup: {
            from: 'categories',
            localField: 'destination.categories',
            foreignField: '_id',
            as: 'destination.categories',
          },
        },
        {
          $unwind: {
            path: '$destination.categories',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $match: {
            'destination.categories.label': { $regex: word, $options: 'i' },
          },
        },
      ];
    }
    return [];
  }
}
