import { ObjectIdToString } from '@/shared/decorators/objectIdTransformer.transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ResponseCategoryDTO {
  constructor(label: string, status: string, main?: string, _id?: string) {
    this._id = _id;
    this.label = label;
    this.status = status;
    this.main = main;
  }

  @ApiPropertyOptional()
  @Expose()
  @ObjectIdToString()
  _id?: string;

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
