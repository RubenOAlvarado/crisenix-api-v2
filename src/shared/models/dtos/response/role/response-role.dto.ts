import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Types } from 'mongoose';

export class ResponseRoleDTO {
  @ApiPropertyOptional()
  @Expose()
  _id?: Types.ObjectId | string;

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
