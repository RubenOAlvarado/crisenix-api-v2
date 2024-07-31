import { ResponseOriginCityDTO } from '../origincity/responseorigincity.dto';
import { Expose, Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Currency } from '@/shared/enums/currency.enum';
import { ObjectIdToString } from '@/shared/decorators/objectIdTransformer.transformer';

export class ResponsePriceDTO {
  @ApiPropertyOptional()
  @Expose()
  @ObjectIdToString()
  _id?: string;

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
