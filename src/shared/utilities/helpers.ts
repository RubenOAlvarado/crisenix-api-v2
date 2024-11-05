import { PaginateResult } from '@/shared/interfaces/paginate.interface';
import {
  BadRequestException,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PipelineStage, Types } from 'mongoose';
import { PaginationDTO } from '../models/dtos/searcher/pagination.dto';

const logger = new Logger();

export function createPaginatedObject<T>(
  docs: T[],
  totalDocs: number,
  page: number,
  limit: number,
): PaginateResult<T> {
  return {
    docs,
    totalDocs,
    hasPrevPage: page > 1,
    hasNextPage: page < Math.ceil(totalDocs / limit),
    page: page,
    totalPages: Math.ceil(totalDocs / limit),
  };
}

export function handleErrorsOnServices(message: string, error: any) {
  logger.error(`${message}: ${error}`);

  if (typeof error.code === 'string' && error.code.includes('auth/')) {
    throw new BadRequestException(error.message);
  } else if (error.code === 11000) {
    throw new BadRequestException('Duplicate code.');
  } else if (
    error instanceof BadRequestException ||
    error instanceof NotFoundException
  ) {
    throw error;
  } else {
    throw new InternalServerErrorException(message);
  }
}

export function castMongooseDocsToPlainObject<T extends { toObject(): any }>(
  docs: T[],
): T[] {
  return docs.map((doc) => doc.toObject());
}

export function handleDocumentsId(objectId?: string | Types.ObjectId) {
  if (objectId instanceof Types.ObjectId) {
    return objectId.toString();
  }
  return objectId as string;
}

export function statusQueryBuilder(status?: string): PipelineStage | undefined {
  return status ? { $match: { status } } : undefined;
}

export function sortQueryBuilder(sort = 'createdAt'): PipelineStage {
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
