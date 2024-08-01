import {
  ArrayNotEmpty,
  IsDateString,
  IsDefined,
  IsEnum,
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
import { ItineraryDTO } from './itinerary.dto';
import { Type } from 'class-transformer';
import { BoxLunch } from 'src/shared/enums/tour/boxlunch.enum';

export class CreateTourDTO {
  @ApiProperty({
    description: 'Destination id',
    example: '5f9d5c2b9d6b280b685d3e4e',
  })
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  destination: string;

  @ApiPropertyOptional({
    enum: BoxLunch,
    description: 'Box lunch indicator',
    example: BoxLunch.NO,
  })
  @IsOptional()
  @IsEnum(BoxLunch)
  boxLunch?: BoxLunch;

  @ApiProperty({
    description: 'Tour code',
    example: 'T-0001',
  })
  @IsNotEmpty()
  @IsString()
  code: string;

  @ApiProperty({
    description: 'Tour seats number',
    example: 20,
  })
  @IsNotEmpty()
  @IsNumber()
  seating: number;

  @ApiPropertyOptional({
    description: 'Available seats',
    example: 10,
  })
  @IsOptional()
  @IsNumber()
  availableSeat?: number;

  @ApiPropertyOptional({
    description: 'Ocuppied seats',
    example: 10,
  })
  @IsOptional()
  @IsNumber()
  ocuppiedSeat?: number;

  @ApiProperty({
    description: 'Tour initial date',
    example: '2020-10-30T05:00:00.000Z',
  })
  @IsNotEmpty()
  @IsDateString()
  initDate: Date;

  @ApiPropertyOptional({
    description: 'hour and place of aboard',
    type: AboardHourDTO,
    isArray: true,
  })
  @IsOptional()
  @ArrayNotEmpty()
  @IsDefined()
  @Type(() => AboardHourDTO)
  @ValidateNested({ each: true })
  aboardHour?: Array<AboardHourDTO>;

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
  @IsNotEmpty()
  @IsMongoId()
  transport: string;

  @ApiProperty({
    description: 'Tour return date',
    example: '2020-10-30T05:00:00.000Z',
  })
  @IsNotEmpty()
  @IsDateString()
  returnDate: Date;

  @ApiPropertyOptional({
    description: 'hour and place of return',
    type: AboardHourDTO,
    isArray: true,
  })
  @IsOptional()
  @ArrayNotEmpty()
  @IsDefined()
  @Type(() => AboardHourDTO)
  @ValidateNested({ each: true })
  returnHour?: Array<AboardHourDTO>;

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
  coordinator?: Array<CoordinatorDTO>;

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
  @IsNotEmpty()
  @IsMongoId()
  tourType: string;

  @ApiPropertyOptional({
    description: 'Tour included',
    type: String,
    isArray: true,
  })
  @IsOptional()
  @IsMongoId({ each: true })
  included?: Array<string>;

  @ApiPropertyOptional({
    description: 'Tour itinerary, array of activities',
    type: ItineraryDTO,
    isArray: true,
  })
  @IsOptional()
  @ArrayNotEmpty()
  @IsDefined()
  @Type(() => ItineraryDTO)
  @ValidateNested({ each: true })
  itineraries?: Array<ItineraryDTO>;

  @ApiProperty({
    description: 'Tour prices',
    type: String,
    isArray: true,
  })
  @ArrayNotEmpty()
  @IsMongoId({ each: true })
  prices?: Array<string>;

  constructor(
    destination: string,
    boxLunch: BoxLunch,
    code: string,
    seating: number,
    initDate: Date,
    transport: string,
    returnDate: Date,
    tourType: string,
    availableSeat?: number,
    ocuppiedSeat?: number,
    aboardHour?: Array<AboardHourDTO>,
    days?: number,
    nights?: number,
    returnHour?: Array<AboardHourDTO>,
    coordinator?: Array<CoordinatorDTO>,
    front?: string,
    recommendations?: string,
    included?: Array<string>,
    itineraries?: Array<ItineraryDTO>,
    prices?: Array<string>,
  ) {
    this.destination = destination;
    this.boxLunch = boxLunch;
    this.code = code;
    this.seating = seating;
    this.availableSeat = availableSeat;
    this.ocuppiedSeat = ocuppiedSeat;
    this.initDate = initDate;
    this.aboardHour = aboardHour;
    this.days = days;
    this.nights = nights;
    this.transport = transport;
    this.returnDate = returnDate;
    this.returnHour = returnHour;
    this.coordinator = coordinator;
    this.front = front;
    this.recommendations = recommendations;
    this.tourType = tourType;
    this.included = included;
    this.itineraries = itineraries;
    this.prices = prices;
  }
}
