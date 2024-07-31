import { ObjectIdToString } from '@/shared/decorators/objectIdTransformer.transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ResponseCaptionsDTO {
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

  constructor(name: string, status: string) {
    this.name = name;
    this.status = status;
  }
}
