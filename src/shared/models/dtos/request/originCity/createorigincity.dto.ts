import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOriginCityDTO {
  @ApiProperty({
    description: 'Name of the state where the city is located',
    example: 'Jalisco',
    required: true,
  })
  @IsNotEmpty({ message: 'State is required' })
  @IsString({ message: 'State must be a string' })
  state!: string;

  @ApiProperty({
    description: 'Name of the city',
    example: 'Guadalajara',
    required: true,
  })
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  @MaxLength(150)
  name!: string;
}
