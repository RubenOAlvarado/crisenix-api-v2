import { Currency } from '@/shared/enums/currency.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTourPriceDTO {
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

  @ApiPropertyOptional({
    description: 'Inapam base price (just for old people).',
    example: 100,
  })
  @IsOptional()
  @IsNumber()
  inapam?: number;

  constructor(
    currency: Currency,
    general?: number,
    singleBase?: number,
    doubleBase?: number,
    tripleBase?: number,
    quadrupleBase?: number,
    minor?: number,
    inapam?: number,
  ) {
    this.currency = currency;
    this.general = general;
    this.singleBase = singleBase;
    this.doubleBase = doubleBase;
    this.tripleBase = tripleBase;
    this.quadrupleBase = quadrupleBase;
    this.minor = minor;
    this.inapam = inapam;
  }
}
