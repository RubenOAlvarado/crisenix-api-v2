import { PipelineStage } from 'mongoose';
import { PaginationDTO } from '../dtos/pagination.dto';
import { SearcherDTO } from '../enums/searcher/destination/searcher.dto';
import { QueryBuilder } from './builders/query.builder';
import {
  paginationQuery,
  sortQueryBuilder,
  statusQueryBuilder,
} from './helpers';
import { SearchStrategyFactory } from '../factories/searchDestinationStrategy.factory';
import { SearchableFields } from '../enums/searcher/destination/fields.enum';
import { PopulateSubcatalogsStrategy } from '../strategies/populateDestinationSubCatalogs.strategy';

export function pipelinesMaker(
  { word, field, status, subCatalog, sort }: SearcherDTO,
  { page, limit }: PaginationDTO,
): PipelineStage[] {
  const builder = new QueryBuilder();

  builder.addStage(statusQueryBuilder(status));

  const searchStrategy = SearchStrategyFactory.getSearchStrategy(
    field as SearchableFields,
  );
  builder.addStage(searchStrategy.search({ field, word }));

  const populateSubCatalogsStrategy = new PopulateSubcatalogsStrategy();
  builder.addStage(populateSubCatalogsStrategy.search({ subCatalog }));

  builder.addStage(sortQueryBuilder(sort));
  builder.addStage(paginationQuery({ page, limit }));

  return builder.build();
}
