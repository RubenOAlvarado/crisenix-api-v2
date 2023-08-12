import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AboardHourDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  hour: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  aboardPoint: string;

  constructor(hour: string, aboardPoint: string) {
    this.hour = hour;
    this.aboardPoint = aboardPoint;
  }
}
