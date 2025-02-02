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
      {
        $lookup: {
          from: 'transports',
          localField: 'transport',
          foreignField: '_id',
          as: 'transport',
        },
      },
      {
        $unwind: { path: '$transport', preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
          from: 'prices',
          localField: 'price',
          foreignField: '_id',
          as: 'price',
        },
      },
      {
        $unwind: { path: '$price', preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
          from: 'itineraryactivities',
          localField: 'itinerary',
          foreignField: '_id',
          as: 'itinerary',
        },
      },
      {
        $unwind: { path: '$itinerary', preserveNullAndEmptyArrays: true },
      },
    ];
  }
  return [];
}

export function pipelinesMaker({
  field,
  word,
  shouldPopulate,
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
    searchStrategy.search({
      field,
      word,
      shouldPopulate,
      sort,
      status,
      page,
      limit,
    }),
  );

  builder.addStage(populateSubcatalogsQuery(shouldPopulate));
  builder.addStage(sortQueryBuilder(sort));
  builder.addStage(paginationQuery({ page, limit }));

  return builder.build();
}
