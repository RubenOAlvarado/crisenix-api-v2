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
import { SearcherDestinationDto } from '../models/dtos/searcher/destination/searcherDestination.dto';

export function pipelinesMaker({
  field,
  word,
  shouldPopulate,
  sort,
  page,
  limit,
  status,
}: SearcherDestinationDto): PipelineStage[] {
  const builder = new QueryBuilder();

  builder.addStage(statusQueryBuilder(status));

  const searchStrategy = SearchStrategyFactory.getSearchStrategy(
    field as SearchableFields,
  );
  builder.addStage(
    searchStrategy.search({
      field,
      word,
      shouldPopulate,
      sort,
      page,
      limit,
      status,
    }),
  );

  const populateSubCatalogsStrategy = new PopulateSubcatalogsStrategy();
  builder.addStage(populateSubCatalogsStrategy.search({ shouldPopulate }));

  builder.addStage(sortQueryBuilder(sort));
  builder.addStage(paginationQuery({ page, limit }));

  return builder.build();
}
