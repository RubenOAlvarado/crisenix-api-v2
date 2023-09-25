import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ResponseAboardPointDTO } from '../aboardpoint/responseaboardpoint.dto';
import { AboardPointsTransformer } from '../../../utilities/transformers/aboardpoint.transformer';

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

  @ApiProperty({ type: String })
  state: string;

  @ApiProperty({ type: String })
  name: string;

  @ApiPropertyOptional({ type: ResponseAboardPointDTO, isArray: true })
  @AboardPointsTransformer()
  aboardPoints?: Array<ResponseAboardPointDTO>;

  @ApiProperty({ type: String })
  status: string;
}
