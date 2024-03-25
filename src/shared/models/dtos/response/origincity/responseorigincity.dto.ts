import { ResponseAboardPointDTO } from '../aboardpoint/responseaboardpoint.dto';
import { AboardPointsTransformer } from '@/shared/utilities/transformers/aboardpoint.transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Types } from 'mongoose';

export class ResponseOriginCityDTO {
  constructor(
    state: string,
    name: string,
    status: string,
    aboardPoints?: ResponseAboardPointDTO[],
  ) {
    this.state = state;
    this.name = name;
    this.aboardPoints = aboardPoints;
    this.status = status;
  }

  @ApiPropertyOptional()
  @Expose()
  _id?: Types.ObjectId;

  @ApiProperty()
  @Expose()
  state: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty({
    type: ResponseAboardPointDTO,
    isArray: true,
  })
  @Expose()
  @AboardPointsTransformer()
  aboardPoints?: ResponseAboardPointDTO[];

  @ApiProperty()
  @Expose()
  status: string;
}
