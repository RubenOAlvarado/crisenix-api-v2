import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetReportDTO {
  @ApiProperty({
    description: 'Saler database id',
  })
  @IsNotEmpty()
  @IsMongoId()
  saler: string;

  @ApiProperty({
    description: 'year and month to look',
  })
  @IsNotEmpty()
  @IsString()
  dateToLook: string;
}
