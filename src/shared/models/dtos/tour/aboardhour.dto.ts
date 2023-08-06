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
}
