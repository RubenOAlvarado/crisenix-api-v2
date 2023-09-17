import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class TourByIncluded {
  @ApiProperty({
    example: 'Comida',
    description: 'Included service to look for',
  })
  @IsNotEmpty()
  @IsString()
  included: string;

  constructor(included: string) {
    this.included = included;
  }
}
