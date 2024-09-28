import { PipelineStage } from 'mongoose';
import { SearcherTourDTO } from '../dtos/searcher/tour/searcherTour.dto';
import { SearchStrategy } from '../interfaces/search.strategy.interface';
import { SearchableTourFields } from '../enums/searcher/tour/fields.enum';

export class SearchByTourTypeStrategy
  implements SearchStrategy<SearcherTourDTO>
{
  search({ field, word }: SearcherTourDTO): PipelineStage[] {
    if (field === SearchableTourFields.TYPE) {
      return [
        {
          $lookup: {
            from: 'tourtypes',
            localField: 'tourType',
            foreignField: '_id',
            as: 'tourType',
          },
        },
        {
          $unwind: { path: '$tourType', preserveNullAndEmptyArrays: true },
        },
        {
          $match: {
            'tourType.name': { $regex: word, $options: 'i' },
          },
        },
      ];
    }
    return [];
  }
}
