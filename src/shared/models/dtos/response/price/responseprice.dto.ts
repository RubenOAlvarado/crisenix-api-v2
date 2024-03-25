import { Types } from 'mongoose';
import { ResponseOriginCityDTO } from '../origincity/responseorigincity.dto';
import { Expose, Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ResponsePriceDTO {
  @ApiPropertyOptional()
  @Expose()
  _id?: Types.ObjectId;

  @ApiProperty()
  @Type(() => ResponseOriginCityDTO)
  @Expose()
  city: ResponseOriginCityDTO;

  @ApiProperty()
  @Expose()
  currency: string;

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

  constructor(city: ResponseOriginCityDTO, currency: string) {
    this.city = city;
    this.currency = currency;
  }
}
