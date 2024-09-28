import { SearcherDestinationDto } from '../dtos/searcher/destination/searcherDestination.dto';
import { SearchableFields } from '../enums/searcher/destination/fields.enum';
import { SearchStrategy } from '../interfaces/search.strategy.interface';
import { DefaultDestinationSearcher } from '../strategies/defaultDestinationSearcher.category';
import { SearchDestinationByCategory } from '../strategies/searchDestinationByCategory.strategy';

export class SearchStrategyFactory {
  static getSearchStrategy(
    field: SearchableFields,
  ): SearchStrategy<SearcherDestinationDto> {
    switch (field) {
      case SearchableFields.CATEGORY:
        return new SearchDestinationByCategory();
      default:
        return new DefaultDestinationSearcher();
    }
  }
}
