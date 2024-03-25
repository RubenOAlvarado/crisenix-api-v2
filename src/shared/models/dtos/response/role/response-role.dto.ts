import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Types } from 'mongoose';

export class ResponseRoleDTO {
  @ApiPropertyOptional()
  @Expose()
  _id?: Types.ObjectId;

  @ApiProperty()
  @Expose()
  description: string;

  @ApiProperty()
  @Expose()
  status: string;

  @ApiProperty()
  @Expose()
  permissions: any;

  constructor(description: string, status: string, permissions: any) {
    this.description = description;
    this.status = status;
    this.permissions = permissions;
  }
}
