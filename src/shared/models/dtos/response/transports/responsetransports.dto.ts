import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { ResponseTransportTypeDTO } from '../translationType/responseTranslationType.dto';
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
  @Type(() => ResponseTransportTypeDTO)
  @Expose()
  TransportType?: ResponseTransportTypeDTO | string;

  constructor(name: string, TransportType: ResponseTransportTypeDTO | string) {
    this.name = name;
    this.TransportType = TransportType;
  }
}
