import {
  IsDateString,
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
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  destination: string;

  @ApiPropertyOptional({ enum: BoxLunch })
  @IsOptional()
  @IsString()
  boxLunch?: BoxLunch;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  code: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  seating: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  availableSeat?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  ocuppiedSeat?: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  initDate: Date;

  @ApiPropertyOptional({
    description: 'hour and place of aboard',
    type: [AboardHourDTO],
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => AboardHourDTO)
  aboardHour?: AboardHourDTO[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Min(1)
  days?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  nights?: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsMongoId()
  transport: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  returnDate: Date;

  @ApiPropertyOptional({
    description: 'hour and place of return',
    type: [AboardHourDTO],
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => AboardHourDTO)
  returnHour?: AboardHourDTO[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsMongoId({ each: true })
  departure?: Array<string>;

  @ApiPropertyOptional({
    description: 'Coordinator/s assigned to the tour',
    type: [CoordinatorDTO],
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CoordinatorDTO)
  coordinator?: CoordinatorDTO[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  front?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  recommendations?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsMongoId()
  tourType: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsMongoId({ each: true })
  included?: Array<string>;

  @ApiPropertyOptional({
    description: 'Tour itinerary, array of activities',
    type: [ItineraryDTO],
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ItineraryDTO)
  itinerary?: ItineraryDTO[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsMongoId({ each: true })
  price?: Array<string>;

  constructor(
    destination: string,
    code: string,
    seating: number,
    initDate: Date,
    transport: string,
    returnDate: Date,
    tourType: string,
  ) {
    this.destination = destination;
    this.code = code;
    this.seating = seating;
    this.initDate = initDate;
    this.transport = transport;
    this.returnDate = returnDate;
    this.tourType = tourType;
  }
}
