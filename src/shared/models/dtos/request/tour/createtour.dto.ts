import {
  ArrayNotEmpty,
  IsDateString,
  IsDefined,
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AboardHourDTO } from './aboardhour.dto';
import { CoordinatorDTO } from './coordinator.dto';
import { Type } from 'class-transformer';

export class CreateTourDTO {
  @ApiProperty({
    description: 'Destination id',
    example: '5f9d5c2b9d6b280b685d3e4e',
    required: true,
  })
  @IsNotEmpty({
    message: 'You cannot create a tour without a destination.',
  })
  @IsString()
  @IsMongoId({ message: 'Destination must be a mongoId' })
  destination: string;

  @ApiProperty({
    description: 'Tour code',
    example: 'T-0001',
    required: true,
  })
  @IsNotEmpty({
    message: 'Tour needs a code to be created.',
  })
  @IsString()
  @MaxLength(10, { message: 'Tour code is too long' })
  code: string;

  @ApiProperty({
    description: 'Tour seats number',
    example: 20,
    required: true,
  })
  @IsNotEmpty({
    message: 'Tour needs a seating number to be created.',
  })
  @IsNumber()
  seats: number;

  @ApiPropertyOptional({
    description: 'Available seats',
    example: 10,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  availableSeats?: number;

  @ApiPropertyOptional({
    description: 'Ocuppied seats',
    example: 10,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  ocuppiedSeats?: number;

  @ApiProperty({
    description: 'Tour initial date',
    example: '2020-10-30T05:00:00.000Z',
    required: true,
  })
  @IsNotEmpty({
    message: 'Tour needs an initial date to be created.',
  })
  @IsDateString()
  initDate: Date;

  @ApiProperty({
    description: 'Tour days long',
    example: 5,
    required: true,
  })
  @IsInt()
  @IsPositive()
  @Min(1)
  days: number;

  @ApiProperty({
    description: 'Tour nights long',
    example: 4,
    required: true,
  })
  @IsInt()
  @IsPositive()
  nights: number;

  @ApiProperty({
    description: 'Tour transport',
    example: '5f9d5c2b9d6b280b685d3e4e',
    required: true,
  })
  @IsNotEmpty({
    message: 'Tour needs a transport to be created.',
  })
  @IsMongoId({ message: 'Transport must be a mongoId' })
  transport: string;

  @ApiProperty({
    description: 'Tour return date',
    example: '2020-10-30T05:00:00.000Z',
    required: true,
  })
  @IsNotEmpty({
    message: 'Tour needs a return date to be created.',
  })
  @IsDateString()
  returnDate: Date;

  @ApiProperty({
    description: 'Tour type',
    example: '5f9d5c2b9d6b280b685d3e4e',
    required: true,
  })
  @IsNotEmpty({
    message: 'Tour needs a type to be created.',
  })
  @IsMongoId({ message: 'Tour type must be a mongoId' })
  tourType: string;

  @ApiProperty({
    description: 'Tour prices',
    type: String,
    isArray: true,
    required: true,
  })
  @ArrayNotEmpty()
  @IsMongoId({ each: true })
  prices: Array<string>;

  @ApiPropertyOptional({
    description: 'Hours and aboarding points for the tour',
    type: AboardHourDTO,
    isArray: true,
    required: false,
  })
  @IsOptional()
  @ArrayNotEmpty()
  @IsDefined()
  @Type(() => AboardHourDTO)
  @ValidateNested({ each: true })
  aboardHours?: Array<AboardHourDTO>;

  @ApiPropertyOptional({
    description: 'Hours and return points for the tour',
    type: AboardHourDTO,
    isArray: true,
  })
  @IsOptional()
  @ArrayNotEmpty()
  @IsDefined()
  @Type(() => AboardHourDTO)
  @ValidateNested({ each: true })
  returnHours?: Array<AboardHourDTO>;

  @ApiPropertyOptional({
    description: 'Coordinator/s assigned to the tour',
    type: CoordinatorDTO,
    isArray: true,
  })
  @IsOptional()
  @ArrayNotEmpty()
  @IsDefined()
  @Type(() => CoordinatorDTO)
  @ValidateNested({ each: true })
  coordinators?: Array<CoordinatorDTO>;

  @ApiPropertyOptional({
    description: 'Tour front image',
    example: 'https://www.example.com/image.jpg',
    required: false,
  })
  @IsOptional()
  @IsUrl({ require_protocol: true }, { message: 'Front image must be an URL' })
  front?: string;

  @ApiPropertyOptional({
    description: 'Tour recommendations',
    example: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  recommendations?: string;

  @ApiPropertyOptional({
    description: 'Tour included services',
    type: String,
    isArray: true,
    required: false,
  })
  @IsOptional()
  @ArrayNotEmpty()
  @IsMongoId({ each: true })
  includedServices?: Array<string>;

  @ApiPropertyOptional({
    description: 'Tour itinerary',
    type: String,
    isArray: true,
    required: false,
  })
  @IsOptional()
  @ArrayNotEmpty()
  @IsMongoId({ each: true })
  itinerary?: Array<string>;

  constructor(
    destination: string,
    code: string,
    seats: number,
    initDate: Date,
    transport: string,
    returnDate: Date,
    tourType: string,
    days: number,
    nights: number,
    prices: Array<string>,
  ) {
    this.destination = destination;
    this.code = code;
    this.seats = seats;
    this.initDate = initDate;
    this.days = days;
    this.nights = nights;
    this.transport = transport;
    this.returnDate = returnDate;
    this.tourType = tourType;
    this.prices = prices;
  }
}
