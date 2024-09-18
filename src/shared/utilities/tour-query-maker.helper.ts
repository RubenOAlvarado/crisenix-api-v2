import { PipelineStage } from 'mongoose';
import { PaginationDTO } from '../dtos/pagination.dto';
import { SearcherTourDTO } from '../enums/searcher/tour/searcher.dto';
import { QueryBuilder } from './builders/query.builder';
import { SearchToursStrategyFactory } from '../factories/searchToursStrategy.factory';
import { SearchableTourFields } from '../enums/searcher/tour/fields.enum';
import {
  paginationQuery,
  sortQueryBuilder,
  statusQueryBuilder,
} from './helpers';

export function populateSubcatalogsQuery(populate?: boolean): PipelineStage[] {
  if (populate) {
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
    ];
  }
  return [];
}

export function pipelinesMaker(
  { field, word, status, populate, sort }: SearcherTourDTO,
  { page, limit }: PaginationDTO,
): PipelineStage[] {
  const builder = new QueryBuilder();
  builder.addStage(statusQueryBuilder(status));

  const searchStrategy = SearchToursStrategyFactory.getSearchQuery(
    field as SearchableTourFields,
  );
  builder.addStage(searchStrategy.search({ field, word }));

  builder.addStage(populateSubcatalogsQuery(populate));
  builder.addStage(sortQueryBuilder(sort));
  builder.addStage(paginationQuery({ page, limit }));

  return builder.build();
}
