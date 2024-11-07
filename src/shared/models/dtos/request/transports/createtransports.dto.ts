import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateTransportsDTO {
  @ApiProperty({
    description: 'Name of the transport.',
    example: 'Bus',
  })
  @IsNotEmpty({ message: 'Name is required.' })
  @IsString()
  @MaxLength(150)
  name: string;

  @ApiProperty({
    description: 'Transport type for the transport.',
  })
  @IsNotEmpty({ message: 'Transport type is required.' })
  @IsMongoId({ message: 'Transport type must be a mongo Id.' })
  transportType: string;

  constructor(name: string, transportType: string) {
    this.name = name;
    this.transportType = transportType;
  }
}
