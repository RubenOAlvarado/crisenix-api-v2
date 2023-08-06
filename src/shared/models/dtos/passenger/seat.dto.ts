import {
  IsAlphanumeric,
  IsMongoId,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignSeatDTO {
  @IsNotEmpty()
  @ApiProperty({
    description: 'Passenger id',
  })
  @IsMongoId()
  id: string;

  @IsNotEmpty()
  @ApiProperty({
    description: 'Assigned seat',
  })
  @IsString()
  seatNumber: string;
}
