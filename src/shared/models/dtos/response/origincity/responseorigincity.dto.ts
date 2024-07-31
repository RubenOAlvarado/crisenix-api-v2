import { ObjectIdToString } from '@/shared/decorators/objectIdTransformer.transformer';
import { ResponseAboardPointDTO } from '../aboardpoint/responseaboardpoint.dto';
import { AboardPointsTransformer } from '@/shared/utilities/transformers/aboardpoint.transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ResponseOriginCityDTO {
  constructor(
    state: string,
    name: string,
    status: string,
    _id?: string,
    aboardPoints?: ResponseAboardPointDTO[] | string[],
  ) {
    this.state = state;
    this.name = name;
    this.status = status;
    this._id = _id;
    this.aboardPoints = aboardPoints;
  }

  @ApiPropertyOptional()
  @Expose()
  @ObjectIdToString()
  _id?: string;

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
