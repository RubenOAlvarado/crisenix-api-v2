import { PipelineStage } from 'mongoose';
import { SearchStrategy } from '../interfaces/search.strategy.interface';
import { SearchableTourFields } from '../enums/searcher/tour/fields.enum';
import dayjs from 'dayjs';
import { SearcherTourDTO } from '../models/dtos/searcher/tour/searcherTour.dto';

export class SearchTourByInitDateStrategy
  implements SearchStrategy<SearcherTourDTO>
{
  search({ field, word }: SearcherTourDTO): PipelineStage[] {
    if (field === SearchableTourFields.INITDATE) {
      const newDate = new Date(word);
      const end = dayjs(word).endOf('M');

      return [
        {
          $match: {
            initDate: {
              $gte: newDate,
              $lt: end.toDate(),
            },
          },
        },
      ];
    }
    return [];
  }
}
