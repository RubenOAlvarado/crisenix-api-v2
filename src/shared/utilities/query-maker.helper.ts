import { SearchableFields } from '../enums/searcher/destination/fields.enum';
import { SearcherDTO } from '../enums/searcher/destination/searcher.dto';
import { SearcherTourDTO } from '../enums/searcher/tour/searcher.dto';
import { SearchableTourFields } from '../enums/searcher/tour/fields.enum';
import { PipelineStage } from 'mongoose';
import { PaginationDTO } from '../dtos/pagination.dto';
import { SortFields } from '../enums/searcher/destination/sortFields.enum';
import { SortTourFields } from '../enums/searcher/tour/sortFields.enum';

export function generateDestinationsSearcherQuery(
  {
    field,
    word,
    status,
    populate = false,
    sort = 'createdAt' as SortFields,
  }: SearcherDTO,
  { page, limit }: PaginationDTO,
): PipelineStage[] {
  const query: PipelineStage[] = [];
  if (status) {
    query.push({
      $match: {
        status,
      },
    });
  }

  if (field === SearchableFields.CATEGORY) {
    query.push({
      $match: {
        'category.label': {
          $regex: word,
          $options: 'i',
        },
      },
    });
  } else if (field && word) {
    query.push({
      $match: {
        [field]: {
          $regex: word,
          $options: 'i',
        },
      },
    });
  }

  if (populate) {
    query.push({
      $lookup: {
        from: 'origincities',
        localField: 'originCity',
        foreignField: '_id',
        as: 'originCity',
      },
    });

    query.push({
      $unwind: { path: '$originCity', preserveNullAndEmptyArrays: true },
    });

    query.push({
      $lookup: {
        from: 'translationtypes',
        localField: 'translationType',
        foreignField: '_id',
        as: 'translationType',
      },
    });

    query.push({
      $unwind: { path: '$translationType', preserveNullAndEmptyArrays: true },
    });

    query.push({
      $lookup: {
        from: 'aboardpoints',
        localField: 'aboardPoint',
        foreignField: '_id',
        as: 'aboardPoint',
      },
    });

    query.push({
      $unwind: { path: '$aboardPoint', preserveNullAndEmptyArrays: true },
    });
  }

  query.push({
    $sort: {
      [sort]: -1,
    },
  });

  query.push({
    $facet: {
      docs: [{ $skip: (page - 1) * limit }, { $limit: limit * 1 }],
      totalDocs: [{ $count: 'total' }],
    },
  });

  query.push({
    $project: {
      docs: 1,
      totalDocs: { $arrayElemAt: ['$totalDocs.total', 0] },
    },
  });

  return query;
}

export function alikeQueryBuilder(
  word: string,
  status: string | undefined,
  sort = 'createdAt' as SortFields,
): PipelineStage[] {
  const query: PipelineStage[] = [];
  if (status) {
    query.push({
      $match: {
        status,
      },
    });
  }
  query.push({
    $lookup: {
      from: 'categories',
      localField: 'category',
      foreignField: '_id',
      as: 'category',
    },
  });
  query.push({
    $unwind: { path: '$category', preserveNullAndEmptyArrays: true },
  });
  query.push({
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
  });
  query.push({
    $sort: {
      [sort]: -1,
    },
  });

  return query;
}

export function generateTourSearcherQuery(
  {
    field,
    word,
    status,
    populate,
    sort = 'createdAt' as SortTourFields,
  }: SearcherTourDTO,
  { page, limit }: PaginationDTO,
) {
  const query: PipelineStage[] = [];
  if (status) {
    query.push({
      $match: {
        status,
      },
    });
  }
  const tourFields = [
    SearchableTourFields.CODE,
    SearchableTourFields.NAME,
    SearchableTourFields.DESCRIPTION,
    SearchableTourFields.DCODE,
  ];
  if (tourFields.includes(field) && word) {
    query.push({
      $lookup: {
        from: 'destinations',
        localField: 'destination',
        foreignField: '_id',
        as: 'destination',
      },
    });
    query.push({
      $unwind: { path: '$destination', preserveNullAndEmptyArrays: true },
    });
    query.push({
      $match: {
        [field]: word,
      },
    });
  } else if (field === SearchableTourFields.TYPE) {
    query.push({
      $lookup: {
        from: 'tourtypes',
        localField: 'tourType',
        foreignField: '_id',
        as: 'tourType',
      },
    });
    query.push({
      $unwind: { path: '$tourType', preserveNullAndEmptyArrays: true },
    });
    query.push({
      $match: {
        'tourType.name': word,
      },
    });
  } else if (field === SearchableTourFields.INCLUDEDSERVICE) {
    query.push({
      $lookup: {
        from: 'includeds',
        localField: 'included',
        foreignField: '_id',
        as: 'included',
      },
    });
    query.push({
      $unwind: { path: '$included', preserveNullAndEmptyArrays: true },
    });
    query.push({
      $match: {
        'included.concept': word,
      },
    });
  } else if (field === SearchableTourFields.DCATEGORY) {
    query.push({
      $lookup: {
        from: 'destinations',
        localField: 'destination',
        foreignField: '_id',
        as: 'destination',
      },
    });
    query.push({
      $unwind: { path: '$destination', preserveNullAndEmptyArrays: true },
    });
    query.push({
      $lookup: {
        from: 'categories',
        localField: 'destination.category',
        foreignField: '_id',
        as: 'destination.category',
      },
    });
    query.push({
      $unwind: {
        path: '$destination.category',
        preserveNullAndEmptyArrays: true,
      },
    });
    query.push({
      $match: {
        'destination.category.label': word,
      },
    });
  }

  if (populate) {
    query.push({
      $lookup: {
        from: 'tourtypes',
        localField: 'tourType',
        foreignField: '_id',
        as: 'tourType',
      },
    });

    query.push({
      $unwind: { path: '$tourType', preserveNullAndEmptyArrays: true },
    });

    query.push({
      $lookup: {
        from: 'origincities',
        localField: 'originCity',
        foreignField: '_id',
        as: 'originCity',
      },
    });

    query.push({
      $unwind: { path: '$originCity', preserveNullAndEmptyArrays: true },
    });

    query.push({
      $lookup: {
        from: 'aboardpoints',
        localField: 'aboardPoint',
        foreignField: '_id',
        as: 'aboardPoint',
      },
    });

    query.push({
      $unwind: { path: '$aboardPoint', preserveNullAndEmptyArrays: true },
    });
  }
  query.push({
    $sort: {
      [sort]: -1,
    },
  });

  query.push({
    $facet: {
      docs: [{ $skip: (page - 1) * limit }, { $limit: limit * 1 }],
      totalDocs: [{ $count: 'total' }],
    },
  });

  query.push({
    $project: {
      docs: 1,
      totalDocs: { $arrayElemAt: ['$totalDocs.total', 0] },
    },
  });

  return query;
}
