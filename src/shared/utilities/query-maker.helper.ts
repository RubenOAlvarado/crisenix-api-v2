import { DestinationFields } from '../enums/searcher/destination/fields.enum';
import { SearcherDTO } from '../dtos/searcher.dto';
import { PipelineStage } from 'mongoose';

export function generateDestinationsSearcherQuery({
  field,
  word,
  status,
}: SearcherDTO): PipelineStage[] {
  const query: PipelineStage[] = [];
  if (status) {
    query.push({
      $match: {
        status,
      },
    });
  }
  if (field && word) {
    query.push({
      $match: {
        [field]: {
          $regex: word,
          $options: 'i',
        },
      },
    });
  } else if (field === DestinationFields.CATEGORY) {
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
        'category.label': {
          $regex: word,
          $options: 'i',
        },
      },
    });
  }

  query.push({
    $sort: {
      createdAt: -1,
    },
  });

  query.push({
    $project: {
      __v: 0,
      createdAt: 0,
    },
  });

  return query;
}
