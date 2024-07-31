import { ObjectIdToString } from '@/shared/decorators/objectIdTransformer.transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ResponseCatalogDTO {
  @ApiPropertyOptional()
  @Expose()
  @ObjectIdToString()
  _id?: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  description: string;

  @ApiProperty()
  @Expose()
  status: string;

  constructor(name: string, description: string, status: string) {
    this.name = name;
    this.description = description;
    this.status = status;
  }
}
