import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Types } from 'mongoose';
export class ResponseAboardPointDTO {
  constructor(name: string, status: string) {
    this.name = name;
    this.status = status;
  }

  @ApiPropertyOptional()
  @Expose()
  _id?: Types.ObjectId | string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  status: string;
}
