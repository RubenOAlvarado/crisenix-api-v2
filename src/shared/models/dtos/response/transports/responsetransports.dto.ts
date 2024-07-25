import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { ResponseTransferTypeDTO } from '../translationType/responseTranslationType.dto';
import { Expose, Type } from 'class-transformer';
import { Types } from 'mongoose';

export class ResponseTransportsDTO {
  @ApiPropertyOptional()
  @Expose()
  _id?: Types.ObjectId | string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Type(() => ResponseTransferTypeDTO)
  @Expose()
  transferType?: ResponseTransferTypeDTO | string;

  constructor(name: string, transferType: ResponseTransferTypeDTO | string) {
    this.name = name;
    this.transferType = transferType;
  }
}
