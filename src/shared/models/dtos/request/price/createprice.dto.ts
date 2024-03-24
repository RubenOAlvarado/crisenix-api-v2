import {
  IsIn,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Currency } from 'src/shared/enums/currency.enum';

export class CreatePriceDTO {
  @ApiProperty({
    description: 'City id that this price belongs to.',
    example: '60f1b2b3e6b2f1b2b3e6b2f1',
  })
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  city: string;

  @ApiProperty({
    enum: Currency,
    description: 'Currency of the price.',
    example: Currency.MX,
  })
  @IsNotEmpty()
  @IsIn([Currency.MX, Currency.USA])
  @IsString()
  currency: Currency;

  @ApiPropertyOptional({
    description: 'General price.',
    example: 100,
  })
  @IsOptional()
  @IsNumber()
  general?: number;

  @ApiPropertyOptional({
    description: 'Single base price.',
    example: 100,
  })
  @IsOptional()
  @IsNumber()
  singleBase?: number;

  @ApiPropertyOptional({
    description: 'Double base price.',
    example: 100,
  })
  @IsOptional()
  @IsNumber()
  doubleBase?: number;

  @ApiPropertyOptional({
    description: 'Triple base price.',
    example: 100,
  })
  @IsOptional()
  @IsNumber()
  tripleBase?: number;

  @ApiPropertyOptional({
    description: 'Quadruple base price.',
    example: 100,
  })
  @IsOptional()
  @IsNumber()
  quadrupleBase?: number;

  @ApiPropertyOptional({
    description: 'Minor base price (just for childrens).',
    example: 100,
  })
  @IsOptional()
  @IsNumber()
  minor?: number;

  @ApiProperty({
    description: 'Inapam base price (just for old people).',
    example: 100,
  })
  @IsOptional()
  @IsNumber()
  inapam?: number;

  constructor(city: string, currency: Currency) {
    this.city = city;
    this.currency = currency;
  }
}
