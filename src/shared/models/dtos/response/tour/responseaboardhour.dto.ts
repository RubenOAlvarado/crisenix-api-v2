import { ApiProperty } from '@nestjs/swagger';
import { ResponseAboardPointDTO } from '../aboardpoint/responseaboardpoint.dto';

export class ResponseAboardHourDTO {
  @ApiProperty({
    description: 'Aboard hour',
    type: String,
  })
  hour: string;

  @ApiProperty({
    description: 'Aboard point',
    type: ResponseAboardPointDTO,
  })
  aboardPoint: ResponseAboardPointDTO;

  constructor(hour: string, aboardPoint: ResponseAboardPointDTO) {
    this.hour = hour;
    this.aboardPoint = aboardPoint;
  }
}
