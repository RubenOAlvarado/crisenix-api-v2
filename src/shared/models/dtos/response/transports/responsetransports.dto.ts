import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { ResponseTransferTypeDTO } from '../translationType/responseTranslationType.dto';
import { Expose, Type } from 'class-transformer';
import { ObjectIdToString } from '@/shared/decorators/objectIdTransformer.transformer';

export class ResponseTransportsDTO {
  @ApiPropertyOptional()
  @Expose()
  @ObjectIdToString()
  _id?: string;

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
