import { ApiProperty } from '@nestjs/swagger';
import { ResponseAboardPointDTO } from '../aboardpoint/responseaboardpoint.dto';
import { Expose } from 'class-transformer';

export class ResponseAboardHourDTO {
  @ApiProperty()
  @Expose()
  hour: string;

  @ApiProperty()
  @Expose()
  aboardPoint: ResponseAboardPointDTO | string;

  constructor(hour: string, aboardPoint: ResponseAboardPointDTO | string) {
    this.hour = hour;
    this.aboardPoint = aboardPoint;
  }
}
