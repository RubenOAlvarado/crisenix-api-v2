import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';
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

  constructor(id: string, seatNumber: string) {
    this.id = id;
    this.seatNumber = seatNumber;
  }
}
