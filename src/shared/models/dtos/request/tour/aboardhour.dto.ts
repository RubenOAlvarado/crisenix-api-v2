import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AboardHourDTO {
  @ApiProperty({
    description: 'Aboard hour',
    example: '10:00',
  })
  @IsNotEmpty()
  @IsString()
  hour: string;

  @ApiProperty({
    description: 'Aboard point id',
    example: '5f9d5c2b9d6b280b685d3e4e',
  })
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  aboardPoint: string;

  constructor(hour: string, aboardPoint: string) {
    this.hour = hour;
    this.aboardPoint = aboardPoint;
  }
}
