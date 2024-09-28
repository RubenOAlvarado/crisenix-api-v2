import { PipelineStage } from 'mongoose';
import { QueryBuilder } from './builders/query.builder';
import {
  paginationQuery,
  sortQueryBuilder,
  statusQueryBuilder,
} from './helpers';
import { SearchStrategyFactory } from '../factories/searchDestinationStrategy.factory';
import { SearchableFields } from '../enums/searcher/destination/fields.enum';
import { PopulateSubcatalogsStrategy } from '../strategies/populateDestinationSubCatalogs.strategy';
import { SearcherDestinationDto } from '../dtos/searcher/destination/searcherDestination.dto';
import { QueryDTO } from '../dtos/query.dto';

export function pipelinesMaker(
  { field, word, subCatalog, sort }: SearcherDestinationDto,
  { page, limit, status }: QueryDTO,
): PipelineStage[] {
  const builder = new QueryBuilder();

  builder.addStage(statusQueryBuilder(status));

  const searchStrategy = SearchStrategyFactory.getSearchStrategy(
    field as SearchableFields,
  );
  builder.addStage(searchStrategy.search({ field, word, subCatalog, sort }));

  const populateSubCatalogsStrategy = new PopulateSubcatalogsStrategy();
  builder.addStage(populateSubCatalogsStrategy.search({ subCatalog }));

  builder.addStage(sortQueryBuilder(sort));
  builder.addStage(paginationQuery({ page, limit }));

  return builder.build();
}
