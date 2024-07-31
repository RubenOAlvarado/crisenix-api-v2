import { ObjectIdToString } from '@/shared/decorators/objectIdTransformer.transformer';
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ResponseRoleDTO {
  @ApiPropertyOptional()
  @Expose()
  @ObjectIdToString()
  _id?: string;

  @ApiProperty()
  @Expose()
  description: string;

  @ApiProperty()
  @Expose()
  status: string;

  constructor(description: string, status: string) {
    this.description = description;
    this.status = status;
  }
}
