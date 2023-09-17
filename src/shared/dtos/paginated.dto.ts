import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PaginatedDTO<TData> {
  constructor(
    docs: TData[],
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
    type: [Object],
  })
  docs: TData[];

  @ApiProperty({
    description: 'Total documents registered.',
    type: Number,
  })
  totalDocs: number;

  @ApiProperty({
    description: 'Has previous page.',
    type: Boolean,
  })
  hasPrevPage: boolean;

  @ApiProperty({
    description: 'Has next page.',
    type: Boolean,
  })
  hasNextPage: boolean;

  @ApiPropertyOptional({
    description: 'Current page.',
    type: Number,
  })
  page?: number | undefined;

  @ApiProperty({
    description: 'Total pages with sended docs per page.',
    type: Number,
  })
  totalPages: number;
}
