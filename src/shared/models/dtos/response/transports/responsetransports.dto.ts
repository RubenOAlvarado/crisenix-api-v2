import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { ResponseTranslationTypeDTO } from '../translationType/responseTranslationType.dto';
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
  @Type(() => ResponseTranslationTypeDTO)
  @Expose()
  translationType: ResponseTranslationTypeDTO;

  constructor(name: string, translationType: ResponseTranslationTypeDTO) {
    this.name = name;
    this.translationType = translationType;
  }
}
