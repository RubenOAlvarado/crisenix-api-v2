import { PaginateResult } from '@/shared/interfaces/paginate.interface';
import {
  BadRequestException,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';

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
