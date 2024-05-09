import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { ResponseTransferTypeDTO } from '../translationType/responseTranslationType.dto';
import { Expose, Type } from 'class-transformer';
import { Types } from 'mongoose';

export class ResponseTransportsDTO {
  @ApiPropertyOptional()
  @Expose()
  _id?: Types.ObjectId;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Type(() => ResponseTransferTypeDTO)
  @Expose()
  transferType?: ResponseTransferTypeDTO;

  constructor(name: string, transferType: ResponseTransferTypeDTO) {
    this.name = name;
    this.transferType = transferType;
  }
}
