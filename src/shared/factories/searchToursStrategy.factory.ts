import { SearchableTourFields } from '../enums/searcher/tour/fields.enum';
import { SearcherTourDTO } from '../enums/searcher/tour/searcher.dto';
import { SearchStrategy } from '../interfaces/search.strategy.interface';
import { NoSearchStrategy } from '../strategies/noSearch.strategy';
import { SearchTourByDestinationCategory } from '../strategies/searchTourByDestinationCategory.strategy';
import { SearchTourByIncludedServiceStrategy } from '../strategies/searchTourByIncludedService.strategy';
import { SearchTourByInitDateStrategy } from '../strategies/searchTourByInitDate.strategy';
import { SearchByTourParamsStrategy } from '../strategies/searchByTourParams.strategy';
import { SearchByTourTypeStrategy } from '../strategies/searchByTourType.strategy';

export class SearchToursStrategyFactory {
  static getSearchQuery(
    field: SearchableTourFields,
  ): SearchStrategy<SearcherTourDTO> {
    switch (field) {
      case SearchableTourFields.CODE:
      case SearchableTourFields.NAME:
      case SearchableTourFields.DESCRIPTION:
      case SearchableTourFields.DCODE:
        return new SearchByTourParamsStrategy();
      case SearchableTourFields.TYPE:
        return new SearchByTourTypeStrategy();
      case SearchableTourFields.INCLUDEDSERVICE:
        return new SearchTourByIncludedServiceStrategy();
      case SearchableTourFields.DCATEGORY:
        return new SearchTourByDestinationCategory();
      case SearchableTourFields.INITDATE:
        return new SearchTourByInitDateStrategy();
      default:
        return new NoSearchStrategy();
    }
  }
}
