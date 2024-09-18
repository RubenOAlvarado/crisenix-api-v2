import { PipelineStage } from 'mongoose';
import { SearcherTourDTO } from '../enums/searcher/tour/searcher.dto';
import { SearchStrategy } from '../interfaces/search.strategy.interface';
import { SearchableTourFields } from '../enums/searcher/tour/fields.enum';

export class SearchTourByIncludedServiceStrategy
  implements SearchStrategy<SearcherTourDTO>
{
  search({ field, word }: SearcherTourDTO): PipelineStage[] {
    if (field === SearchableTourFields.INCLUDEDSERVICE) {
      return [
        {
          $lookup: {
            from: 'includeds',
            localField: 'includeds',
            foreignField: '_id',
            as: 'includeds',
          },
        },
        {
          $unwind: {
            path: '$includeds',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $match: {
            'includeds.concept': {
              $regex: word,
              $options: 'i',
            },
          },
        },
      ];
    }
    return [];
  }
}
