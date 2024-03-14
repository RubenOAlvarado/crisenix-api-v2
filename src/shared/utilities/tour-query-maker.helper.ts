import { PipelineStage } from 'mongoose';
import { PaginationDTO } from '../dtos/pagination.dto';
import { SearcherTourDTO } from '../enums/searcher/tour/searcher.dto';
import { SortTourFields } from '../enums/searcher/tour/sortFields.enum';
import { SearchableTourFields } from '../enums/searcher/tour/fields.enum';
import { SearchType } from '../enums/searcher/search-type.enum';
import { alikeQueryBuilder } from './destination-query-maker.helper';
import dayjs from 'dayjs';
import { TourCatalogs } from '../enums/tour/catalogs.enum';

export function statusQueryBuilder(status?: string): PipelineStage | undefined {
  if (status) {
    return {
      $match: {
        status,
      },
    };
  }
  return undefined;
}

export function sortQueryBuilder(
  sort = 'createdAt' as SortTourFields,
): PipelineStage {
  return {
    $sort: {
      [sort]: 1,
    },
  };
}

export function paginationQuery({
  page,
  limit,
}: PaginationDTO): PipelineStage[] {
  return [
    {
      $facet: {
        docs: [{ $skip: (page - 1) * limit }, { $limit: limit * 1 }],
        totalDocs: [{ $count: 'total' }],
      },
    },
    {
      $project: {
        docs: 1,
        totalDocs: { $arrayElemAt: ['$totalDocs.total', 0] },
      },
    },
  ];
}

export function searchByTourParamsQuery({
  field = SearchableTourFields.NAME,
  word,
}: SearcherTourDTO): PipelineStage[] {
  const tourFields = [
    SearchableTourFields.CODE,
    SearchableTourFields.NAME,
    SearchableTourFields.DESCRIPTION,
    SearchableTourFields.DCODE,
  ];
  if (tourFields.includes(field) && word) {
    return [
      {
        $lookup: {
          from: 'destinations',
          localField: 'destination',
          foreignField: '_id',
          as: 'destination',
        },
      },
      {
        $unwind: { path: '$destination', preserveNullAndEmptyArrays: true },
      },
      {
        $match: {
          [field]: { $regex: word, $options: 'i' },
        },
      },
    ];
  }
  return [];
}

export function searchByTourTypeQuery({
  field,
  word,
}: SearcherTourDTO): PipelineStage[] {
  if (field === SearchableTourFields.TYPE) {
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
        $match: {
          'tourType.name': { $regex: word, $options: 'i' },
        },
      },
    ];
  }
  return [];
}

export function searchByIncludedServiceQuery({
  field,
  word,
}: SearcherTourDTO): PipelineStage[] {
  if (field === SearchableTourFields.INCLUDEDSERVICE) {
    return [
      {
        $lookup: {
          from: 'includeds',
          localField: 'included',
          foreignField: '_id',
          as: 'included',
        },
      },
      {
        $unwind: {
          path: '$included',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: {
          'included.concept': {
            $regex: word,
            $options: 'i',
          },
        },
      },
    ];
  }
  return [];
}

export function searchByDestinationCategory({
  field,
  word,
}: SearcherTourDTO): PipelineStage[] {
  if (field === SearchableTourFields.DCATEGORY) {
    return [
      {
        $lookup: {
          from: 'destinations',
          localField: 'destination',
          foreignField: '_id',
          as: 'destination',
        },
      },
      {
        $unwind: { path: '$destination', preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'destination.category',
          foreignField: '_id',
          as: 'destination.category',
        },
      },
      {
        $unwind: {
          path: '$destination.category',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: {
          'destination.category.label': { $regex: word, $options: 'i' },
        },
      },
    ];
  }
  return [];
}

export function searchByInitDateQuery({
  field,
  word,
}: SearcherTourDTO): PipelineStage[] {
  if (field === SearchableTourFields.INITDATE) {
    const newDate = new Date(word);
    const end = dayjs(word).endOf('M');

    return [
      {
        $match: {
          initDate: {
            $gte: newDate,
            $lt: end.toDate(),
          },
        },
      },
    ];
  }
  return [];
}

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
          from: 'origincities',
          localField: 'originCity',
          foreignField: '_id',
          as: 'originCity',
        },
      },
      {
        $unwind: { path: '$originCity', preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
          from: 'aboardpoints',
          localField: 'aboardPoint',
          foreignField: '_id',
          as: 'aboardPoint',
        },
      },
      {
        $unwind: { path: '$aboardPoint', preserveNullAndEmptyArrays: true },
      },
    ];
  }
  return [];
}

export function searchAlikeTourQuery({
  word,
}: SearcherTourDTO): PipelineStage[] {
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
        from: 'destinations',
        localField: 'destination',
        foreignField: '_id',
        as: 'destination',
      },
    },
    {
      $unwind: { path: '$destination', preserveNullAndEmptyArrays: true },
    },
    {
      $match: {
        $or: [
          {
            'tourType.name': { $regex: word, $options: 'i' },
          },
          {
            code: { $regex: word, $options: 'i' },
          },
          {
            name: { $regex: word, $options: 'i' },
          },
          {
            'destination.description': { $regex: word, $options: 'i' },
          },
        ],
      },
    },
  ];
}

export function pipelinesMaker(
  { field, word, status, populate, sort, searchType }: SearcherTourDTO,
  { page, limit }: PaginationDTO,
): PipelineStage[] {
  if (searchType === SearchType.EXACTMATCH) {
    return [
      statusQueryBuilder(status),
      searchByTourParamsQuery({ field, word }),
      searchByTourTypeQuery({ field, word }),
      searchByIncludedServiceQuery({ field, word }),
      searchByDestinationCategory({ field, word }),
      searchByInitDateQuery({ field, word }),
      populateSubcatalogsQuery(populate),
      sortQueryBuilder(sort),
      paginationQuery({ page, limit }),
    ]
      .filter(Boolean)
      .flatMap((result) =>
        Array.isArray(result) ? result : [result],
      ) as PipelineStage[];
  }
  return [
    statusQueryBuilder(status),
    alikeQueryBuilder(word),
    sortQueryBuilder(sort),
    paginationQuery({ page, limit }),
  ]
    .filter(Boolean)
    .flatMap((result) =>
      Array.isArray(result) ? result : [result],
    ) as PipelineStage[];
}

export function createQueryForCatalog(catalog: string) {
  const departurePopulate = {
    path: 'departure',
    options: {
      sort: { date: 1, hour: 1 },
    },
  };

  switch (catalog) {
    case 'returnHour':
    case 'aboardHour':
      return [
        {
          path: `${catalog}.aboardPoint`,
          model: 'AboardPoints',
        },
        departurePopulate,
      ];
    case TourCatalogs.PRICE:
      return [
        {
          path: catalog,
          populate: {
            path: 'city',
            model: 'OriginCity',
          },
        },
        departurePopulate,
      ];
    case TourCatalogs.ITINERARY:
      return [
        {
          path: catalog,
          populate: {
            path: 'clasification',
            model: 'Clasifications',
          },
        },
        departurePopulate,
      ];
    default:
      return {
        path: catalog,
        populate: departurePopulate,
      };
  }
}
