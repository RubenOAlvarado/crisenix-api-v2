import { PipelineStage } from 'mongoose';
import { SearchableTourFields } from '../enums/searcher/tour/fields.enum';
import { SearcherTourDTO } from '../dtos/searcher/tour/searcherTour.dto';
import { SearchStrategy } from '../interfaces/search.strategy.interface';

export class SearchByTourParamsStrategy
  implements SearchStrategy<SearcherTourDTO>
{
  search({
    field = SearchableTourFields.NAME,
    word,
  }: SearcherTourDTO): PipelineStage[] {
    const tourFields = [
      SearchableTourFields.CODE,
      SearchableTourFields.NAME,
      SearchableTourFields.DESCRIPTION,
      SearchableTourFields.DCODE,
    ];

    if (tourFields.includes(field) && word) {
      return [
        {
          $lookup: {
            from: 'destinations',
            localField: 'destination',
            foreignField: '_id',
            as: 'destination',
          },
        },
        { $unwind: { path: '$destination', preserveNullAndEmptyArrays: true } },
        { $match: { [field]: { $regex: word, $options: 'i' } } },
      ];
    }

    return [];
  }
}
