import { ObjectIdToString } from '@/shared/decorators/objectIdTransformer.transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ResponseClassificationDTO {
  constructor(
    name: string,
    _id?: string,
    description?: string,
    status?: string,
  ) {
    this.name = name;
    this.description = description;
    this.status = status;
    this._id = _id;
  }

  @ApiPropertyOptional()
  @Expose()
  @ObjectIdToString()
  _id?: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiPropertyOptional()
  @Expose()
  description?: string;

  @ApiPropertyOptional()
  @Expose()
  status?: string;
}
