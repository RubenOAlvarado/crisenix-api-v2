import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class QueryDTO {
  @ApiProperty({
    default: 1,
    description: 'Page number',
  })
  @IsNotEmpty()
  @IsNumberString()
  page: number;

  @ApiProperty({
    default: 10,
    description: 'Number of items per page',
  })
  @IsNotEmpty()
  @IsNumberString()
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
