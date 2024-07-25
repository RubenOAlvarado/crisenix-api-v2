import { ResponseAboardPointDTO } from '../aboardpoint/responseaboardpoint.dto';
import { AboardPointsTransformer } from '@/shared/utilities/transformers/aboardpoint.transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Types } from 'mongoose';

export class ResponseOriginCityDTO {
  constructor(state: string, name: string, status: string) {
    this.state = state;
    this.name = name;
    this.status = status;
  }

  @ApiPropertyOptional()
  @Expose()
  _id?: Types.ObjectId | string;

  @ApiProperty()
  @Expose()
  state: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiPropertyOptional({
    type: ResponseAboardPointDTO,
    isArray: true,
  })
  @Expose()
  @AboardPointsTransformer()
  aboardPoints?: ResponseAboardPointDTO[] | string[];

  @ApiProperty()
  @Expose()
  status: string;
}
