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

  docs: TData[];

  @ApiProperty({ type: Number })
  totalDocs: number;

  @ApiProperty({ type: Boolean })
  hasPrevPage: boolean;

  @ApiProperty({ type: Boolean })
  hasNextPage: boolean;

  @ApiPropertyOptional({ type: Number })
  page?: number | undefined;

  @ApiProperty({ type: Number })
  totalPages: number;
}
