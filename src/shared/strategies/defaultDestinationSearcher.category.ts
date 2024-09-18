import { PipelineStage } from 'mongoose';
import { SearchableFields } from '../enums/searcher/destination/fields.enum';
import { SearcherDTO } from '../enums/searcher/destination/searcher.dto';
import { SearchStrategy } from '../interfaces/search.strategy.interface';

export class DefaultDestinationSearcher implements SearchStrategy<SearcherDTO> {
  search({
    field = SearchableFields.NAME,
    word,
  }: SearcherDTO): PipelineStage | undefined {
    return field && field !== SearchableFields.CATEGORY && word
      ? {
          $match: {
            [field]: {
              $regex: word,
              $options: 'i',
            },
          },
        }
      : undefined;
  }
}
