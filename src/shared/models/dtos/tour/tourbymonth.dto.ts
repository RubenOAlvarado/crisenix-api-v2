import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class TourByMonth {
  @ApiProperty({
    description: 'Year and month to look, it search by month',
  })
  @IsNotEmpty()
  @IsString()
  dateToLook: string;
}
