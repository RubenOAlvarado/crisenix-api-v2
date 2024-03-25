import { ResponseOriginCityDTO } from '../origincity/responseorigincity.dto';
import { ResponseAboardPointDTO } from '../aboardpoint/responseaboardpoint.dto';
import { Expose, Type } from 'class-transformer';
import { Types } from 'mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ResponsePassengerDTO {
  @ApiPropertyOptional()
  @Expose()
  _id?: Types.ObjectId;

  @ApiProperty()
  @Expose()
  room: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  lastName: string;

  @ApiPropertyOptional()
  @Expose()
  secondLastName?: string;

  @ApiProperty()
  @Type(() => ResponseOriginCityDTO)
  @Expose()
  originCity: ResponseOriginCityDTO;

  @ApiProperty()
  @Type(() => ResponseAboardPointDTO)
  @Expose()
  aboardPoint: ResponseAboardPointDTO;

  @ApiProperty()
  @Expose()
  price: number;

  @ApiPropertyOptional()
  @Expose()
  passportPhotoUrl?: string;

  @ApiPropertyOptional()
  @Expose()
  visaPhoto?: string;

  @ApiPropertyOptional()
  @Expose()
  seat?: string;

  constructor(
    name: string,
    lastName: string,
    originCity: ResponseOriginCityDTO,
    aboardPoint: ResponseAboardPointDTO,
    price: number,
    room: string,
  ) {
    this.name = name;
    this.lastName = lastName;
    this.originCity = originCity;
    this.aboardPoint = aboardPoint;
    this.price = price;
    this.room = room;
  }
}
