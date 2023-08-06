import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Currency } from 'src/shared/enums/currency.enum';

export class CreatePriceDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  city: string;

  @ApiProperty({ enum: Currency })
  @IsNotEmpty()
  @IsString()
  currency: Currency;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  general?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  singleBase?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  doubleBase?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  tripleBase?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  quadrupleBase?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  minor?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  inapam?: number;
}
