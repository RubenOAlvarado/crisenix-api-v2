import { ResponseOriginCityDTO } from '../origincity/responseorigincity.dto';
import { ResponseAboardPointDTO } from '../aboardpoint/responseaboardpoint.dto';
import { Expose, Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PriceBase } from '@/shared/enums/priceBase.enum';
import { Currency } from '@/shared/enums/currency.enum';
import { ObjectIdToString } from '@/shared/decorators/objectIdTransformer.transformer';

export class ResponsePassengerDTO {
  @ApiPropertyOptional()
  @Expose()
  @ObjectIdToString()
  _id?: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  lastName: string;

  @ApiPropertyOptional()
  @Expose()
  motherLastName?: string;

  @ApiProperty()
  @Type(() => ResponseOriginCityDTO)
  @Expose()
  originCity: ResponseOriginCityDTO | string;

  @ApiProperty()
  @Type(() => ResponseAboardPointDTO)
  @Expose()
  aboardPoint: ResponseAboardPointDTO | string;

  @ApiProperty()
  @Expose()
  price: number;

  @ApiProperty()
  @Expose()
  base: PriceBase;

  @ApiProperty()
  @Expose()
  currency: Currency;

  @ApiProperty()
  @Expose()
  tour: string;

  constructor(
    name: string,
    lastName: string,
    originCity: ResponseOriginCityDTO,
    aboardPoint: ResponseAboardPointDTO,
    price: number,
    base: PriceBase,
    currency: Currency,
    tour: string,
  ) {
    this.name = name;
    this.lastName = lastName;
    this.originCity = originCity;
    this.aboardPoint = aboardPoint;
    this.price = price;
    this.base = base;
    this.currency = currency;
    this.tour = tour;
  }
}
