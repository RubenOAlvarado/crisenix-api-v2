import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Types } from 'mongoose';

export class ResponseCategoryDTO {
  constructor(label: string, status: string) {
    this.label = label;
    this.status = status;
  }

  @ApiPropertyOptional()
  @Expose()
  _id?: Types.ObjectId;

  @ApiProperty()
  @Expose()
  label: string;

  @ApiProperty()
  @Expose()
  status: string;
}
