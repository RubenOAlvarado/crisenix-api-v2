import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateDepartureDTO {
  @ApiProperty({
    description: 'Terminal',
    example: 'T1',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(5)
  terminal: string;

  @ApiProperty({
    description: 'Aeroline',
    example: 'Aeromexico',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  aeroline: string;

  @ApiProperty({
    description: 'Route',
    example: 'MEX-CDMX',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  route: string;

  @ApiProperty({
    description: 'Gate',
    example: 'G1',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(5)
  gate: string;

  @ApiProperty({
    description: 'Flight number',
    example: 'F1',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(5)
  flight: string;

  @ApiProperty({
    description: 'Hour of departure',
    example: '10:00',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(10)
  hour: string;

  @ApiProperty({
    description: 'Date of departure',
    example: '2020-10-30T05:00:00.000Z',
  })
  @IsNotEmpty()
  @IsDateString()
  date: Date;

  constructor(
    terminal: string,
    aeroline: string,
    route: string,
    gate: string,
    flight: string,
    hour: string,
    date: Date,
  ) {
    this.terminal = terminal;
    this.aeroline = aeroline;
    this.route = route;
    this.gate = gate;
    this.flight = flight;
    this.hour = hour;
    this.date = date;
  }
}
