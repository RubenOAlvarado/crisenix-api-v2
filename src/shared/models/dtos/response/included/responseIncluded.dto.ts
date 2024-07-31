import { ObjectIdToString } from '@/shared/decorators/objectIdTransformer.transformer';
import { Entry } from '@/shared/enums/entry.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ResponseIncludedDTO {
  @ApiPropertyOptional()
  @Expose()
  @ObjectIdToString()
  _id?: string;

  @ApiProperty()
  @Expose()
  concept: string;

  @ApiProperty()
  @Expose()
  included: string;

  @ApiProperty()
  @Expose()
  publish: string;

  @ApiProperty()
  @Expose()
  entry: Entry;

  @ApiProperty()
  @Expose()
  status: string;

  constructor(
    concept: string,
    included: string,
    publish: string,
    entry: Entry,
    status: string,
    _id?: string,
  ) {
    this.concept = concept;
    this.included = included;
    this.publish = publish;
    this.entry = entry;
    this.status = status;
    this._id = _id;
  }
}
