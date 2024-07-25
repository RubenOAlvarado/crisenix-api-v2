import { SearchableFields } from '../enums/searcher/destination/fields.enum';
import { PipelineStage } from 'mongoose';
import { PaginationDTO } from '../dtos/pagination.dto';
import { SortFields } from '../enums/searcher/destination/sortFields.enum';
import { Status } from '../enums/status.enum';
import { SearcherDTO } from '../enums/searcher/destination/searcher.dto';

export function statusQueryBuilder(status?: Status): PipelineStage | undefined {
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
  sort = 'createdAt' as SortFields,
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

export function searchByCategoryQuery({
  field,
  word,
}: SearcherDTO): PipelineStage[] {
  if (field === SearchableFields.CATEGORY && word) {
    return [
      {
        $lookup: {
          from: 'categories',
          localField: 'categories',
          foreignField: '_id',
          as: 'categories',
        },
      },
      {
        $unwind: { path: '$categories', preserveNullAndEmptyArrays: true },
      },
      {
        $match: {
          'categories.label': {
            $regex: word,
            $options: 'i',
          },
        },
      },
    ];
  }
  return [];
}

export function populateSubcatalogsQuery(
  subCatalog?: boolean,
): PipelineStage[] | undefined {
  if (subCatalog) {
    return [
      {
        $lookup: {
          from: 'origincities',
          localField: 'originCities',
          foreignField: '_id',
          as: 'originCities',
        },
      },
      {
        $unwind: { path: '$originCities', preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
          from: 'transferTypes',
          localField: 'transferTypes',
          foreignField: '_id',
          as: 'transferTypes',
        },
      },
      {
        $unwind: { path: '$transferTypes', preserveNullAndEmptyArrays: true },
      },
    ];
  }
  return undefined;
}

export function generateDefaultSearcherQuery({
  field = SearchableFields.NAME,
  word,
}: {
  field?: SearchableFields;
  word: string;
}): PipelineStage | undefined {
  if (field !== SearchableFields.CATEGORY) {
    return {
      $match: {
        [field]: {
          $regex: word,
          $options: 'i',
        },
      },
    };
  }
  return undefined;
}

export function alikeQueryBuilder(word: string): PipelineStage[] {
  return [
    {
      $lookup: {
        from: 'categories',
        localField: 'categories',
        foreignField: '_id',
        as: 'categories',
      },
    },
    {
      $unwind: { path: '$categories', preserveNullAndEmptyArrays: true },
    },
    {
      $match: {
        $or: [
          {
            description: {
              $regex: word,
              $options: 'i',
            },
          },
          {
            code: {
              $regex: word,
              $options: 'i',
            },
          },
          {
            name: {
              $regex: word,
              $options: 'i',
            },
          },
          {
            'categories.label': {
              $regex: word,
              $options: 'i',
            },
          },
        ],
      },
    },
  ];
}

export function pipelinesMaker(
  { word, field, status, subCatalog, sort }: SearcherDTO,
  { page, limit }: PaginationDTO,
): PipelineStage[] {
  return [
    statusQueryBuilder(status),
    searchByCategoryQuery({ field, word }),
    generateDefaultSearcherQuery({ field, word }),
    populateSubcatalogsQuery(subCatalog),
    sortQueryBuilder(sort),
    paginationQuery({ page, limit }),
  ]
    .filter(Boolean)
    .flatMap((result) =>
      Array.isArray(result) ? result : [result],
    ) as PipelineStage[];
}
