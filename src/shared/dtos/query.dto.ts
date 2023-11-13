import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class QueryDTO {
  @ApiProperty({
    default: 1,
    description: 'Page number',
    type: Number,
  })
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  page: number;

  @ApiProperty({
    default: 10,
    description: 'Number of items per page',
    type: Number,
  })
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  limit: number;

  @ApiPropertyOptional({
    default: 'Activo',
    description: 'Status to look for (optional)',
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  status?: string;

  constructor(page: number, limit: number, status?: string) {
    this.page = page;
    this.limit = limit;
    this.status = status;
  }
}
