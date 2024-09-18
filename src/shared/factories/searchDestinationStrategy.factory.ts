import { SearchableFields } from '../enums/searcher/destination/fields.enum';
import { SearcherDTO } from '../enums/searcher/destination/searcher.dto';
import { SearchStrategy } from '../interfaces/search.strategy.interface';
import { DefaultDestinationSearcher } from '../strategies/defaultDestinationSearcher.category';
import { NoSearchStrategy } from '../strategies/noSearch.strategy';
import { SearchDestinationByCategory } from '../strategies/searchDestinationByCategory.strategy';

export class SearchStrategyFactory {
  static getSearchStrategy(
    field: SearchableFields,
  ): SearchStrategy<SearcherDTO> {
    switch (field) {
      case SearchableFields.NAME:
      case SearchableFields.CODE:
      case SearchableFields.DESCRIPTION:
        return new DefaultDestinationSearcher();
      case SearchableFields.CATEGORY:
        return new SearchDestinationByCategory();
      default:
        return new NoSearchStrategy();
    }
  }
}
