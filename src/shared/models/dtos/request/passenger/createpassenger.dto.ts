import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PriceBase } from '@/shared/enums/priceBase.enum';
import { Currency } from '@/shared/enums/currency.enum';

export class CreatePassengerDTO {
  @ApiProperty({
    description: 'Passenger room number',
    example: '123',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(15)
  room: string;

  @ApiProperty({
    description: 'Passenger name',
    example: 'John',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  name: string;

  @ApiProperty({
    description: 'Passenger last name',
    example: 'Doe',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  lastName: string;

  @ApiPropertyOptional({
    description: 'Passenger second last name',
    example: 'Doe',
  })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  secondLastName?: string;

  @ApiProperty({
    description: 'Passenger origin city',
  })
  @IsNotEmpty()
  @IsMongoId()
  originCity: string;

  @ApiProperty({
    description: 'Passenger aboard point',
  })
  @IsNotEmpty()
  @IsMongoId()
  aboardPoint: string;

  @ApiProperty({
    description: 'Price payed by the passenger',
    example: 100,
  })
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty({
    description: 'Passenger base',
    example: 'general',
    enum: PriceBase,
  })
  @IsNotEmpty()
  @IsEnum(PriceBase)
  base: PriceBase;

  @ApiProperty({
    description: 'Passenger currency',
    example: 'MXN',
    enum: Currency,
  })
  @IsNotEmpty()
  @IsEnum(Currency)
  currency: Currency;

  @ApiPropertyOptional({
    description:
      'Passenger passport photo url if required (need to be uploaded to firebase first)',
    example: 'https://firebasestorage.googleapis.com/v0/b/...',
  })
  @IsOptional()
  @IsUrl()
  passportPhoto?: string;

  @ApiPropertyOptional({
    description:
      'Passenger visa photo url if required (need to be uploaded to firebase first)',
    example: 'https://firebasestorage.googleapis.com/v0/b/...',
  })
  @IsOptional()
  @IsUrl()
  visaPhoto?: string;

  @ApiProperty({
    description: 'Tour id',
    example: '123456789012345678901234',
  })
  @IsNotEmpty()
  @IsMongoId()
  tour: string;

  constructor(
    name: string,
    lastName: string,
    originCity: string,
    aboardPoint: string,
    price: number,
    base: PriceBase,
    currency: Currency,
    room: string,
    tour: string,
  ) {
    this.name = name;
    this.lastName = lastName;
    this.originCity = originCity;
    this.aboardPoint = aboardPoint;
    this.price = price;
    this.room = room;
    this.base = base;
    this.currency = currency;
    this.tour = tour;
  }
}
