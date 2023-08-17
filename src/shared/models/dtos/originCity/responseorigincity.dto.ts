import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ResponseAboardPointDTO } from '../aboardpoint/responseaboardpoint.dto';
import { AboardPointsTransformer } from '../../../utilities/transformers/aboardpoint.transformer';

export class ResponseOriginCityDTO {
  constructor(
    state: string,
    name: string,
    status: string,
    createdAt?: Date,
    _id?: string,
    aboardPoints?: ResponseAboardPointDTO[],
  ) {
    this.state = state;
    this.name = name;
    this.aboardPoints = aboardPoints;
    this.status = status;
    this.createdAt = createdAt;
    this._id = _id;
  }

  @ApiProperty({ type: String })
  state: string;

  @ApiProperty({ type: String })
  name: string;

  @ApiPropertyOptional({ type: ResponseAboardPointDTO, isArray: true })
  @AboardPointsTransformer()
  aboardPoints?: Array<ResponseAboardPointDTO>;

  @ApiProperty({ type: String })
  status: string;

  @ApiPropertyOptional({ type: Date, default: Date.now() })
  createdAt?: Date;

  @ApiPropertyOptional({ type: String })
  _id?: string;
}
