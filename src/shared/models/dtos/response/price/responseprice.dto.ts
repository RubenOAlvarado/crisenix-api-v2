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

  @ApiProperty({
    type: ResponseOriginCityDTO,
  })
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

  constructor(
    city: ResponseOriginCityDTO | string,
    currency: Currency,
    _id?: string,
    general?: number,
    singleBase?: number,
    doubleBase?: number,
    tripleBase?: number,
    quadrupleBase?: number,
    minor?: number,
    inapam?: number,
  ) {
    this._id = _id;
    this.city = city;
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
