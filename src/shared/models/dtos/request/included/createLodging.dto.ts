import { HotelStatus } from '@/shared/enums/hotelstatus.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPhoneNumber,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateLodgingDTO {
  @ApiProperty({
    description: `City name`,
    example: 'Ciudad de México',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  city: string;

  @ApiProperty({
    description: `Hotel name`,
    example: 'Fiesta Inn',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  hotel: string;

  @ApiProperty({
    enum: HotelStatus,
    description: `Hotel status`,
    example: HotelStatus.TENTATIVO,
  })
  @IsNotEmpty()
  @IsEnum(HotelStatus)
  @IsString()
  @MaxLength(15)
  status: HotelStatus;

  @ApiProperty({
    description: `Hotel address`,
    example: 'Av. Insurgentes Sur 553, Roma Sur, 06760 Cuauhtémoc, CDMX',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  address: string;

  @ApiProperty({
    description: `Hotel phone number`,
    example: '55 5140 2300',
  })
  @IsNotEmpty()
  @IsPhoneNumber()
  @MaxLength(15)
  phone: string;

  @ApiProperty({
    description: `Reserved nights`,
    example: 2,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  nights: number;

  @ApiProperty({
    description: `Check in date`,
    example: '2024-10-30T05:00:00.000Z',
  })
  @IsNotEmpty()
  @IsDateString()
  checkIn: Date;

  @ApiProperty({
    description: `Check out date`,
    example: '2024-10-30T05:00:00.000Z',
  })
  @IsNotEmpty()
  @IsDateString()
  checkOut: Date;

  @ApiProperty({
    description: `Single room price`,
    example: 2000,
  })
  @IsNotEmpty()
  @IsNumber()
  @MaxLength(6)
  single: number;

  @ApiPropertyOptional({
    description: `Single base room price`,
    example: 2000,
  })
  @IsNotEmpty()
  @IsNumber()
  @MaxLength(6)
  singleBase?: number;

  @ApiPropertyOptional({
    description: `Double base room price`,
    example: 2000,
  })
  @IsNotEmpty()
  @IsNumber()
  @MaxLength(6)
  doubleBase?: number;

  @ApiPropertyOptional({
    description: `Triple base room price`,
    example: 2000,
  })
  @IsNotEmpty()
  @IsNumber()
  @MaxLength(6)
  tripleBase?: number;

  @ApiPropertyOptional({
    description: `Quadruple base room price`,
    example: 2000,
  })
  @IsNotEmpty()
  @IsNumber()
  @MaxLength(6)
  quadrupleBase?: number;

  @ApiPropertyOptional({
    description: `Minor room price (childs)`,
    example: 2000,
  })
  @IsNotEmpty()
  @IsNumber()
  @MaxLength(6)
  minor?: number;

  @ApiPropertyOptional({
    description: `Inpam room price (adults + 60 years old)`,
    example: 2000,
  })
  @IsNotEmpty()
  @IsNumber()
  @MaxLength(6)
  inapam?: number;

  constructor(
    city: string,
    hotel: string,
    status: HotelStatus,
    address: string,
    phone: string,
    nights: number,
    checkIn: Date,
    checkOut: Date,
    single: number,
    singleBase: number,
    doubleBase: number,
    tripleBase: number,
    quadrupleBase: number,
    minor: number,
    inapam: number,
  ) {
    this.city = city;
    this.hotel = hotel;
    this.status = status;
    this.address = address;
    this.phone = phone;
    this.nights = nights;
    this.checkIn = checkIn;
    this.checkOut = checkOut;
    this.single = single;
    this.singleBase = singleBase;
    this.doubleBase = doubleBase;
    this.tripleBase = tripleBase;
    this.quadrupleBase = quadrupleBase;
    this.minor = minor;
    this.inapam = inapam;
  }
}
