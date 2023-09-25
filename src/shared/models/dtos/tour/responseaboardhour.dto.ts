import { ApiProperty } from '@nestjs/swagger';

export class ResponseAboardHourDTO {
  @ApiProperty({
    description: 'Aboard hour',
    type: String,
  })
  hour: string;

  @ApiProperty({
    description: 'Aboard point',
    type: ResponseAboardHourDTO,
  })
  aboardPoint: ResponseAboardHourDTO;

  constructor(hour: string, aboardPoint: ResponseAboardHourDTO) {
    this.hour = hour;
    this.aboardPoint = aboardPoint;
  }
}
