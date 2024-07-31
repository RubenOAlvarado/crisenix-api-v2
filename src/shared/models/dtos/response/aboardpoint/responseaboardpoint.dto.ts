import { ObjectIdToString } from '@/shared/decorators/objectIdTransformer.transformer';
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
export class ResponseAboardPointDTO {
  constructor(name: string, status: string, _id?: string) {
    this.name = name;
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

  @ApiProperty()
  @Expose()
  status: string;
}
