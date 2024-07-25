import { Types } from 'mongoose';
import { ResponseOriginCityDTO } from '../origincity/responseorigincity.dto';
import { Expose, Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Currency } from '@/shared/enums/currency.enum';

export class ResponsePriceDTO {
  @ApiPropertyOptional()
  @Expose()
  _id?: Types.ObjectId | string;

  @ApiProperty()
  @Type(() => ResponseOriginCityDTO)
  @Expose()
  city: ResponseOriginCityDTO | string;

  @ApiProperty()
  @Expose()
  currency: Currency;

  @ApiPropertyOptional()
  @Expose()
  general?: number;

  @ApiPropertyOptional()
  @Expose()
  singleBase?: number;

  @ApiPropertyOptional()
  @Expose()
  doubleBase?: number;

  @ApiPropertyOptional()
  @Expose()
  tripleBase?: number;

  @ApiPropertyOptional()
  @Expose()
  quadrupleBase?: number;

  @ApiPropertyOptional()
  @Expose()
  minor?: number;

  @ApiPropertyOptional()
  @Expose()
  inapam?: number;

  constructor(city: ResponseOriginCityDTO | string, currency: Currency) {
    this.city = city;
    this.currency = currency;
  }
}
