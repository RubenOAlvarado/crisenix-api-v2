import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsString } from 'class-validator';

export class DestinationValidator {
  @ApiProperty({
    description:
      'The id of the destination to look last tour (it is mongo id).',
    example: '5f9d7a3b9d3e9e1b7c9b4b1c',
  })
  @IsString()
  @IsMongoId({ message: 'The destination id is invalid.' })
  destination: string;

  constructor(destination: string) {
    this.destination = destination;
  }
}
