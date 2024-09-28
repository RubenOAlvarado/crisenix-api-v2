import { PipelineStage } from 'mongoose';
import { SearcherTourDTO } from '../dtos/searcher/tour/searcherTour.dto';
import { QueryBuilder } from './builders/query.builder';
import { SearchToursStrategyFactory } from '../factories/searchToursStrategy.factory';
import { SearchableTourFields } from '../enums/searcher/tour/fields.enum';
import {
  paginationQuery,
  sortQueryBuilder,
  statusQueryBuilder,
} from './helpers';
import { PaginatedTourDTO } from '../models/dtos/response/tour/paginatedTour.dto';

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
  { field, word, populate, sort }: SearcherTourDTO,
  { page, limit, status }: PaginatedTourDTO,
): PipelineStage[] {
  const builder = new QueryBuilder();
  builder.addStage(statusQueryBuilder(status));

  const searchStrategy = SearchToursStrategyFactory.getSearchQuery(
    field as SearchableTourFields,
  );
  builder.addStage(searchStrategy.search({ field, word, populate, sort }));

  builder.addStage(populateSubcatalogsQuery(populate));
  builder.addStage(sortQueryBuilder(sort));
  builder.addStage(paginationQuery({ page, limit }));

  return builder.build();
}
