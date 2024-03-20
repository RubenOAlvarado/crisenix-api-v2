import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

export class ResponseDepartureDTO {
  @ApiProperty({
    description: 'ID',
    example: '5f9d0a2d6f6b2e001f9f7a5f',
  })
  _id: Types.ObjectId;

  @ApiProperty({
    description: 'Terminal',
    example: 'T1',
  })
  terminal: string;

  @ApiProperty({
    description: 'Aeroline',
    example: 'Aeromexico',
  })
  aeroline: string;

  @ApiProperty({
    description: 'Route',
    example: 'MEX-CDMX',
  })
  route: string;

  @ApiProperty({
    description: 'Gate',
    example: 'G1',
  })
  gate: string;

  @ApiProperty({
    description: 'Flight number',
    example: 'F1',
  })
  flight: string;

  @ApiProperty({
    description: 'Hour of departure',
    example: '10:00',
  })
  hour: string;

  @ApiProperty({
    description: 'Date of departure',
    example: '2020-10-30T05:00:00.000Z',
  })
  date: Date;

  constructor(
    _id: Types.ObjectId,
    terminal: string,
    aeroline: string,
    route: string,
    gate: string,
    flight: string,
    hour: string,
    date: Date,
  ) {
    this._id = _id;
    this.terminal = terminal;
    this.aeroline = aeroline;
    this.route = route;
    this.gate = gate;
    this.flight = flight;
    this.hour = hour;
    this.date = date;
  }
}
