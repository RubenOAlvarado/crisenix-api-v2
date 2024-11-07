import {
  ArrayNotEmpty,
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDestinationDTO {
  @ApiProperty({
    description: 'Destination code',
    example: 'MEX',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(15, { message: 'Code too long' })
  code: string;

  @ApiProperty({
    description: 'Destination name',
    example: 'Mexico',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(150, { message: 'Name too long' })
  name: string;

  @ApiPropertyOptional({
    description: 'Destination description',
    example: 'Mexico is a country between the U.S. and Central America',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Description too long' })
  description?: string;

  @ApiPropertyOptional({
    description: 'Destination category/ies',
    example: ['5f9d7b9b9d3e4b2b1c1b1c1b'],
  })
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsMongoId({ each: true, message: 'Should have at least one category' })
  categories?: Array<string>;

  @ApiPropertyOptional({
    description: 'Destination tentative dates',
    example: '2023-01-01/2025-01-15',
  })
  @IsOptional()
  @IsString({ message: 'If sended, tentatives dates must not be null' })
  tentativeDates?: string;

  @ApiPropertyOptional({
    description: 'Destination translation route',
    example: 'Mex-NY-Mex',
  })
  @IsOptional()
  @IsNotEmpty()
  transfer?: string;

  @ApiPropertyOptional({
    description: 'Destination photos',
    example: [
      'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.viajacompara.com%',
    ],
  })
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @MaxLength(300, { each: true, message: 'url too long' })
  photos?: Array<string>;

  constructor(code: string, name: string) {
    this.code = code;
    this.name = name;
  }
}
