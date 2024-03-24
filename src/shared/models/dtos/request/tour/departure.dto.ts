import { ApiProperty } from '@nestjs/swagger';

export class DepartureDTO {
  @ApiProperty({
    description: 'Departure aeroline name',
    example: 'Mexicana',
    type: String,
  })
  aeroline: string;

  @ApiProperty({
    description: 'Departure door',
    example: '1',
    type: String,
  })
  door: string;

  @ApiProperty({
    description: 'Departure gate',
    example: 'A1',
    type: String,
  })
  gate: string;

  @ApiProperty({
    description: 'Departure flight number',
    example: '1234',
    type: String,
  })
  flightNumber: string;

  @ApiProperty({
    description: 'Departure date',
    example: '2020-10-30T05:00:00.000Z',
    type: Date,
  })
  date: Date;

  constructor(
    aeroline: string,
    door: string,
    gate: string,
    flightNumber: string,
    date: Date,
  ) {
    this.aeroline = aeroline;
    this.door = door;
    this.gate = gate;
    this.flightNumber = flightNumber;
    this.date = date;
  }
}
