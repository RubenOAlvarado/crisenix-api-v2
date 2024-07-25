import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Types } from 'mongoose';

export class ResponseCategoryDTO {
  constructor(label: string, status: string, main?: string) {
    this.label = label;
    this.status = status;
    this.main = main;
  }

  @ApiPropertyOptional()
  @Expose()
  _id?: Types.ObjectId | string;

  @ApiProperty()
  @Expose()
  label: string;

  @ApiPropertyOptional()
  @Expose()
  main?: string;

  @ApiProperty()
  @Expose()
  status: string;
}
