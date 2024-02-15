import { SearchableFields } from '../enums/searcher/destination/fields.enum';
import { PipelineStage } from 'mongoose';
import { PaginationDTO } from '../dtos/pagination.dto';
import { SortFields } from '../enums/searcher/destination/sortFields.enum';
import { Status } from '../enums/status.enum';
import { SearcherDTO } from '../enums/searcher/destination/searcher.dto';
import { SearchType } from '../enums/searcher/search-type.enum';

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
          localField: 'category',
          foreignField: '_id',
          as: 'category',
        },
      },
      {
        $unwind: { path: '$category', preserveNullAndEmptyArrays: true },
      },
      {
        $match: {
          'category.label': {
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
          from: 'translationtypes',
          localField: 'translationType',
          foreignField: '_id',
          as: 'translationType',
        },
      },
      {
        $unwind: { path: '$translationType', preserveNullAndEmptyArrays: true },
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
        localField: 'category',
        foreignField: '_id',
        as: 'category',
      },
    },
    {
      $unwind: { path: '$category', preserveNullAndEmptyArrays: true },
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
            'category.label': {
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
  { word, field, status, subCatalog, sort, searchType }: SearcherDTO,
  { page, limit }: PaginationDTO,
): PipelineStage[] {
  if (searchType === SearchType.EXACTMATCH) {
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
  return [
    statusQueryBuilder(status),
    alikeQueryBuilder(word),
    populateSubcatalogsQuery(subCatalog),
    sortQueryBuilder(sort),
  ]
    .filter(Boolean)
    .flatMap((result) =>
      Array.isArray(result) ? result : [result],
    ) as PipelineStage[];
}
