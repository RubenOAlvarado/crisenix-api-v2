import { PipelineStage } from 'mongoose';
import { QueryBuilder } from './builders/query.builder';
import { SearchToursStrategyFactory } from '../factories/searchToursStrategy.factory';
import { SearchableTourFields } from '../enums/searcher/tour/fields.enum';
import {
  paginationQuery,
  sortQueryBuilder,
  statusQueryBuilder,
} from './helpers';
import { SearcherTourDTO } from '../models/dtos/searcher/tour/searcherTour.dto';

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

export function pipelinesMaker({
  field,
  word,
  populate,
  sort,
  page,
  limit,
  status,
}: SearcherTourDTO): PipelineStage[] {
  const builder = new QueryBuilder();
  builder.addStage(statusQueryBuilder(status));

  const searchStrategy = SearchToursStrategyFactory.getSearchQuery(
    field as SearchableTourFields,
  );
  builder.addStage(
    searchStrategy.search({ field, word, populate, sort, status, page, limit }),
  );

  builder.addStage(populateSubcatalogsQuery(populate));
  builder.addStage(sortQueryBuilder(sort));
  builder.addStage(paginationQuery({ page, limit }));

  return builder.build();
}
