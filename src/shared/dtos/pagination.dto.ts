import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationDTO {
  @ApiProperty({
    default: 1,
    description: 'Page number',
    type: Number,
  })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  page!: number;

  @ApiProperty({
    default: 10,
    description: 'Number of items per page',
    type: Number,
  })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  limit!: number;
}
