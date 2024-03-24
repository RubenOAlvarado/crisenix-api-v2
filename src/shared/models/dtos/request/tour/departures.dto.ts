import { ApiProperty } from '@nestjs/swagger';
import { DepartureDTO } from './departure.dto';

export class DeparturesDTO {
  @ApiProperty({
    description: 'Departures start object',
    type: DepartureDTO,
  })
  start: DepartureDTO;

  @ApiProperty({
    description: 'Departures end object',
    type: DepartureDTO,
  })
  end: DepartureDTO;

  constructor(start: DepartureDTO, end: DepartureDTO) {
    this.start = start;
    this.end = end;
  }
}
