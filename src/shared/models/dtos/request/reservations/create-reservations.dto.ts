import { Currency } from '@/shared/enums/currency.enum';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';

export class CreateReservationsDTO {
  @ApiProperty({
    description: 'Price of the reservation',
    example: 100,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  price: number;

  @ApiProperty({
    description: 'Currency of the reservation',
    example: Currency.MX,
    enum: Currency,
  })
  @IsString()
  @IsEnum(Currency)
  @IsNotEmpty()
  currency: Currency;

  @IsMongoId()
  @IsNotEmpty()
  tour: string;

  @IsMongoId()
  @IsNotEmpty()
  user: string;

  constructor(price: number, currency: Currency, tour: string, user: string) {
    this.price = price;
    this.currency = currency;
    this.tour = tour;
    this.user = user;
  }
}
