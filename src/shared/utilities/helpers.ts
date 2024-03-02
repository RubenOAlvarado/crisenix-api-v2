import { PaginateResult } from '@/shared/interfaces/paginate.interface';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

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
  if (
    error instanceof BadRequestException ||
    error instanceof NotFoundException
  ) {
    throw error;
  } else {
    throw new InternalServerErrorException(message);
  }
}
