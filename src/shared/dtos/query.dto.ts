import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class QueryDTO {
  @ApiProperty()
  @IsOptional()
  @IsNumberString()
  page: number;

  @ApiProperty()
  @IsOptional()
  @IsNumberString()
  limit: number;

  @ApiPropertyOptional()
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
