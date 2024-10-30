import {
  IsDateString,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsPositive,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Currency } from '@/shared/enums/currency.enum';

export class CreateSaleDTO {
  @ApiProperty({
    description: 'Reservation ID',
    required: true,
    example: '60f4b3b3b3b3b3b3b3b3b3b3',
    type: String,
  })
  @IsNotEmpty()
  @IsMongoId()
  reservation: string;

  @ApiProperty({
    description: 'Total amount',
    required: true,
    example: 1000,
    type: Number,
  })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive({ message: 'Total must be greater than 0' })
  total: number;

  @ApiProperty({
    description: 'Currency',
    required: true,
    example: Currency.MXN,
    type: String,
    enum: Currency,
  })
  @IsNotEmpty()
  @IsEnum(Currency)
  currency: Currency;

  @ApiPropertyOptional({
    description: 'Payment date',
    example: '2022-01-01T00:00:00.000Z',
    type: String,
  })
  @IsNotEmpty({ message: 'Payment date is required' })
  @IsDateString()
  paymentDate: Date;

  constructor(
    reservation: string,
    total: number,
    currency: Currency,
    paymentDate: Date,
  ) {
    this.reservation = reservation;
    this.total = total;
    this.currency = currency;
    this.paymentDate = paymentDate;
  }
}
