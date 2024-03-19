import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Visa } from '@/shared/enums/visa.enum';

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
  category?: Array<string>;

  @ApiPropertyOptional({
    description: 'Destination origin city/ies',
    example: ['5f9d7b9b9d3e4b2b1c1b1c1b'],
  })
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsMongoId({ each: true, message: 'Should have at least one originCity' })
  originCity?: Array<string>;

  @ApiPropertyOptional({
    description: 'Destination tentative dates',
    example: '2023-01-01/2025-01-15',
  })
  @IsOptional()
  @IsString({ message: 'If sended, tentatives dates must not be null' })
  tentativeDates?: string;

  @ApiProperty({
    description: 'Destination passport if required',
    example: true,
  })
  @IsNotEmpty()
  @IsBoolean()
  passport: boolean;

  @ApiProperty({
    enum: Visa,
    description: 'Destination visa indicator (who should tramit it)',
    example: Visa.CLIENTE,
  })
  @IsNotEmpty()
  @IsString()
  visa: Visa;

  @ApiPropertyOptional({
    description: 'Destination translation type/s',
    example: ['5f9d7b9b9d3e4b2b1c1b1c1b'],
  })
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsMongoId({
    each: true,
    message: 'Should have at least one translationType',
  })
  translationType?: Array<string>;

  @ApiPropertyOptional({
    description: 'Destination translation route',
    example: 'Mex-NY-Mex',
  })
  @IsOptional()
  @IsNotEmpty()
  translationRoute?: string;

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

  constructor(code: string, name: string, passport: boolean, visa: Visa) {
    this.code = code;
    this.name = name;
    this.passport = passport;
    this.visa = visa;
  }
}
