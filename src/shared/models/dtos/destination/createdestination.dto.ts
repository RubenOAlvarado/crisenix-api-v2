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
import { Visa } from 'src/shared/enums/visa.enum';

export class CreateDestinationDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(15, { message: 'Code too long' })
  code: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(150, { message: 'Name too long' })
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Description too long' })
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsMongoId({ each: true, message: 'Should have at least one category' })
  category?: Array<string>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsMongoId({ each: true, message: 'Should have at least one originCity' })
  originCity?: Array<string>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: 'If sended, tentatives dates must not be null' })
  tentativeDates?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  passport: boolean;

  @ApiProperty({ enum: Visa })
  @IsNotEmpty()
  @IsString()
  visa: Visa;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsMongoId({
    each: true,
    message: 'Should have at least one translationType',
  })
  translationType?: Array<string>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  translationRoute?: string;

  @ApiPropertyOptional()
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
