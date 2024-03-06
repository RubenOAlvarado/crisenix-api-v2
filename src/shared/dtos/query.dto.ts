import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Status } from '../enums/status.enum';

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
    enum: Status,
  })
  @IsOptional()
  @IsEnum(Status)
  @IsNotEmpty()
  @IsString()
  status?: Status;

  constructor(page: number, limit: number, status?: Status) {
    this.page = page;
    this.limit = limit;
    this.status = status;
  }
}
