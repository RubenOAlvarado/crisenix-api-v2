import {
  IsDateString,
  IsEmail,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SalesStatus } from '../../../enums/sales/salesstatus.enum';
import { SaleOrigin } from '../../../enums/sales/saleorigin.enum';

export class CreateSaleDTO {
  @ApiProperty({
    description: 'Tour id',
    example: '5f9d7a3b9d7a3b9d7a3b9d7a',
  })
  @IsNotEmpty()
  @IsMongoId()
  tour: string;

  @ApiPropertyOptional({
    enum: SalesStatus,
    example: SalesStatus.CHECKED,
    description: 'Sale status',
  })
  @IsOptional()
  @IsString()
  status?: SalesStatus;

  @ApiProperty({
    enum: SaleOrigin,
    example: SaleOrigin.WEB,
    description: 'Sale origin platform',
  })
  @IsNotEmpty()
  @IsString()
  origin: SaleOrigin;

  @ApiProperty({
    example: 'Juan',
    description: 'Client name',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  clientName: string;

  @ApiProperty({
    example: 'Perez',
    description: 'Client last name',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  clientLastName: string;

  @ApiPropertyOptional({
    example: 'Gonzalez',
    description: 'Client mother last name',
  })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  clientMotherLastName?: string;

  @ApiProperty({
    description: 'Client email',
    example: 'test@testing.com',
  })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiPropertyOptional({
    description: 'Client oficial id photo url',
    example: 'https://www.test.com/test.jpg',
  })
  @IsOptional()
  @IsUrl()
  oficialId?: string;

  @ApiProperty({
    description: 'Reserved seats by client',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  reservedSeat: number;

  @ApiProperty({
    description: 'Reservation date',
    example: '2020-10-30T00:00:00.000Z',
  })
  @IsNotEmpty()
  @IsDateString()
  reservationDate: Date;

  @ApiPropertyOptional({
    description: 'Pay limit date',
    example: '2020-10-30T00:00:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  payLimitDate?: Date;

  @ApiPropertyOptional({
    description: 'Total payed mount including all seats',
    example: 100,
  })
  @IsOptional()
  @IsNumber()
  totalPayedMount?: number;

  @ApiProperty({
    description: 'Pay date',
    example: '2020-10-30T00:00:00.000Z',
  })
  @IsNotEmpty()
  @IsDateString()
  payDate: Date;

  @ApiPropertyOptional({
    description: 'Saler id',
    example: '5f9d7a3b9d7a3b9d7a3b9d7a',
  })
  @IsOptional()
  @IsMongoId()
  saler?: string;

  @ApiPropertyOptional({
    description: 'List of passengers ids',
    example: ['5f9d7a3b9d7a3b9d7a3b9d7a'],
  })
  @IsOptional()
  @IsMongoId({ each: true })
  passenger?: Array<string>;

  @ApiPropertyOptional({
    description: 'User id if registered',
    example: '5f9d7a3b9d7a3b9d7a3b9d7a',
  })
  @IsOptional()
  @IsMongoId()
  user?: string;

  constructor(
    tour: string,
    clientName: string,
    clientLastName: string,
    email: string,
    reservedSeat: number,
    reservationDate: Date,
    payDate: Date,
    origin: SaleOrigin,
  ) {
    this.tour = tour;
    this.clientName = clientName;
    this.clientLastName = clientLastName;
    this.email = email;
    this.reservedSeat = reservedSeat;
    this.reservationDate = reservationDate;
    this.payDate = payDate;
    this.origin = origin;
  }
}
