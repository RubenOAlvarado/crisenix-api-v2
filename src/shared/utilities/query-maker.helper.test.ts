import { SearcherDTO } from '../dtos/searcher.dto';
import { SearchableFields } from '../enums/searcher/destination/fields.enum';
import { Status } from '../enums/status.enum';
import { generateDestinationsSearcherQuery } from './query-maker.helper';

describe('generateDestinationsSearcherQuery', () => {
  it('should generate a query with status match', () => {
    const searcher: SearcherDTO = {
      field: SearchableFields.NAME,
      word: 'test',
      status: Status.ACTIVE,
    };

    const query = generateDestinationsSearcherQuery(searcher);

    expect(query).toEqual([
      {
        $match: expect.objectContaining({
          status: Status.ACTIVE,
        }),
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $project: {
          __v: 0,
          createdAt: 0,
        },
      },
    ]);
  });

  it('should generate a query with field and word match', () => {
    const searcher: SearcherDTO = {
      field: 'name' as SearchableFields,
      word: 'test',
    };

    const query = generateDestinationsSearcherQuery(searcher);

    expect(query).toEqual([
      {
        $match: {
          name: {
            $regex: 'test',
            $options: 'i',
          },
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $project: {
          __v: 0,
          createdAt: 0,
        },
      },
    ]);
  });

  it('should generate a query with category match', () => {
    const searcher: SearcherDTO = {
      field: SearchableFields.CATEGORY,
      word: 'test',
    };

    const query = generateDestinationsSearcherQuery(searcher);

    expect(query).toEqual([
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
            $regex: 'test',
            $options: 'i',
          },
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $project: {
          __v: 0,
          createdAt: 0,
        },
      },
    ]);
  });
});
