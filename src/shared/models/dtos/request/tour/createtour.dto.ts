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
  })
  @IsNotEmpty({
    message: 'You cannot create a tour without a destination.',
  })
  @IsString()
  @IsMongoId()
  destination: string;

  @ApiProperty({
    description: 'Tour code',
    example: 'T-0001',
  })
  @IsNotEmpty({
    message: 'Tour needs a code to be created.',
  })
  @IsString()
  code: string;

  @ApiProperty({
    description: 'Tour seats number',
    example: 20,
  })
  @IsNotEmpty({
    message: 'Tour needs a seating number to be created.',
  })
  @IsNumber()
  seats: number;

  @ApiPropertyOptional({
    description: 'Available seats',
    example: 10,
  })
  @IsOptional()
  @IsNumber()
  availableSeats?: number;

  @ApiPropertyOptional({
    description: 'Ocuppied seats',
    example: 10,
  })
  @IsOptional()
  @IsNumber()
  ocuppiedSeats?: number;

  @ApiProperty({
    description: 'Tour initial date',
    example: '2020-10-30T05:00:00.000Z',
  })
  @IsNotEmpty({
    message: 'Tour needs an initial date to be created.',
  })
  @IsDateString()
  initDate: Date;

  @ApiPropertyOptional({
    description: 'Hours and aboarding points for the tour',
    type: AboardHourDTO,
    isArray: true,
  })
  @IsOptional()
  @ArrayNotEmpty()
  @IsDefined()
  @Type(() => AboardHourDTO)
  @ValidateNested({ each: true })
  aboardHours?: Array<AboardHourDTO>;

  @ApiPropertyOptional({
    description: 'Tour days long',
    example: 5,
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Min(1)
  days?: number;

  @ApiPropertyOptional({
    description: 'Tour nights long',
    example: 4,
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  nights?: number;

  @ApiProperty({
    description: 'Tour transport',
    example: '5f9d5c2b9d6b280b685d3e4e',
  })
  @IsNotEmpty({
    message: 'Tour needs a transport to be created.',
  })
  @IsMongoId()
  transport: string;

  @ApiProperty({
    description: 'Tour return date',
    example: '2020-10-30T05:00:00.000Z',
  })
  @IsNotEmpty({
    message: 'Tour needs a return date to be created.',
  })
  @IsDateString()
  returnDate: Date;

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
  })
  @IsOptional()
  @IsUrl()
  front?: string;

  @ApiPropertyOptional({
    description: 'Tour recommendations',
    example: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  recommendations?: string;

  @ApiProperty({
    description: 'Tour type',
    example: '5f9d5c2b9d6b280b685d3e4e',
  })
  @IsNotEmpty({
    message: 'Tour needs a type to be created.',
  })
  @IsMongoId()
  tourType: string;

  @ApiPropertyOptional({
    description: 'Tour included services',
    type: String,
    isArray: true,
  })
  @IsOptional()
  @ArrayNotEmpty()
  @IsDefined()
  @IsMongoId({ each: true })
  includedServices?: Array<string>;

  @ApiPropertyOptional({
    description: 'Tour prices',
    type: String,
    isArray: true,
  })
  @IsOptional()
  @ArrayNotEmpty()
  @IsMongoId({ each: true })
  prices?: Array<string>;

  constructor(
    destination: string,
    code: string,
    seats: number,
    initDate: Date,
    transport: string,
    returnDate: Date,
    tourType: string,
    availableSeats?: number,
    ocuppiedSeats?: number,
    aboardHours?: Array<AboardHourDTO>,
    days?: number,
    nights?: number,
    returnHours?: Array<AboardHourDTO>,
    coordinators?: Array<CoordinatorDTO>,
    front?: string,
    recommendations?: string,
    includedServices?: Array<string>,
    prices?: Array<string>,
  ) {
    this.destination = destination;
    this.code = code;
    this.seats = seats;
    this.availableSeats = availableSeats;
    this.ocuppiedSeats = ocuppiedSeats;
    this.initDate = initDate;
    this.aboardHours = aboardHours;
    this.days = days;
    this.nights = nights;
    this.transport = transport;
    this.returnDate = returnDate;
    this.returnHours = returnHours;
    this.coordinators = coordinators;
    this.front = front;
    this.recommendations = recommendations;
    this.tourType = tourType;
    this.includedServices = includedServices;
    this.prices = prices;
  }
}
