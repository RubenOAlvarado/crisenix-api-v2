import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class PaginatedResponseDTO<T> {
  constructor(
    docs: T[],
    totalDocs: number,
    hasPrevPage: boolean,
    hasNextPage: boolean,
    totalPages: number,
    page?: number | undefined,
  ) {
    this.docs = docs;
    this.totalDocs = totalDocs;
    this.hasPrevPage = hasPrevPage;
    this.hasNextPage = hasNextPage;
    this.page = page;
    this.totalPages = totalPages;
  }

  @ApiProperty({
    description: 'Result documents',
    type: Object,
    isArray: true,
  })
  @Type(() => Object)
  @Expose()
  docs: T[];

  @ApiProperty({
    description: 'Total documents registered.',
    type: Number,
  })
  @Expose()
  totalDocs: number;

  @ApiProperty({
    description: 'Has previous page.',
    type: Boolean,
  })
  @Expose()
  hasPrevPage: boolean;

  @ApiProperty({
    description: 'Has next page.',
    type: Boolean,
  })
  @Expose()
  hasNextPage: boolean;

  @ApiPropertyOptional({
    description: 'Current page.',
    type: Number,
  })
  @Expose()
  page?: number;

  @ApiProperty({
    description: 'Total pages with sended docs per page.',
    type: Number,
  })
  @Expose()
  totalPages: number;
}
