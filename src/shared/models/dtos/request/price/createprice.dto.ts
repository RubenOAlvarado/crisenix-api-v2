import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Currency } from 'src/shared/enums/currency.enum';

export class CreatePriceDTO {
  @ApiProperty({
    description: 'Origin City id that this price belongs to.',
    example: '60f1b2b3e6b2f1b2b3e6b2f1',
    required: true,
  })
  @IsNotEmpty({ message: 'Origin City id is required' })
  @IsString()
  @IsMongoId({ message: 'Origin City id must be a valid ObjectId' })
  originCity: string;

  @ApiProperty({
    enum: Currency,
    description: 'Currency of the price.',
    example: Currency.MXN,
    default: Currency.MXN,
    required: true,
  })
  @IsNotEmpty({ message: 'Currency is required' })
  @IsEnum(Currency)
  currency: Currency;

  @ApiPropertyOptional({
    description: 'General price.',
    example: 100,
    required: true,
  })
  @IsNotEmpty({ message: 'General price is required' })
  @IsNumber()
  @IsPositive({ message: 'General price must be a positive number' })
  generalPrice: number;

  @ApiPropertyOptional({
    description: 'Single base price.',
    example: 100,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive({ message: 'Single base price must be a positive number' })
  singleBasePrice?: number;

  @ApiPropertyOptional({
    description: 'Double base price.',
    example: 100,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive({ message: 'Double base price must be a positive number' })
  doubleBasePrice?: number;

  @ApiPropertyOptional({
    description: 'Triple base price.',
    example: 100,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  tripleBasePrice?: number;

  @ApiPropertyOptional({
    description: 'Quadruple base price.',
    example: 100,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive({ message: 'Quadruple base price must be a positive number' })
  quadrupleBasePrice?: number;

  @ApiPropertyOptional({
    description: 'Minor base price (just for childrens).',
    example: 100,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive({ message: 'Minor base price must be a positive number' })
  minorPrice?: number;

  @ApiPropertyOptional({
    description: 'Inapam base price (just for old people).',
    example: 100,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive({ message: 'Inapam base price must be a positive number' })
  inapamPrice?: number;

  constructor(originCity: string, currency: Currency, generalPrice: number) {
    this.originCity = originCity;
    this.currency = currency;
    this.generalPrice = generalPrice;
  }
}
