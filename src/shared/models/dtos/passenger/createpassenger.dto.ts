import {
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePassengerDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(15)
  room: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  lastName: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @MaxLength(150)
  secondLastName?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsMongoId()
  originCity: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsMongoId()
  aboardPoint: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsMongoId()
  price: string;

  @ApiProperty()
  @IsOptional()
  @IsUrl()
  passportPhoto?: string;

  @ApiProperty()
  @IsOptional()
  @IsUrl()
  visaPhoto?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @MaxLength(15)
  seat?: string;

  constructor(
    name: string,
    lastName: string,
    originCity: string,
    aboardPoint: string,
    price: string,
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
