import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class ItineraryDTO {
  @ApiProperty({
    description: 'Day number',
    example: 1,
  })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @MaxLength(2)
  dayNumber: number;

  @ApiProperty({
    description: 'Activity listed this day',
    example: 'camping',
  })
  @IsNotEmpty()
  @IsMongoId()
  activity: string;

  @ApiPropertyOptional({
    description: 'Activity additional cost (optional)',
    example: 100,
  })
  @IsOptional()
  @IsNumber()
  @MaxLength(6)
  additionalCost?: number;

  @ApiPropertyOptional({
    description: 'Activity initial date (optional)',
    example: '2020-10-30T05:00:00.000Z',
  })
  @IsOptional()
  @IsNotEmpty()
  @IsDateString()
  initDate?: Date;

  @ApiPropertyOptional({
    description: 'Activity initial hour (optional)',
    example: '10:00',
  })
  @IsOptional()
  @IsString()
  initHour?: string;

  @ApiPropertyOptional({
    description: 'Activity finish date (optional)',
    example: '2020-10-30T05:00:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  finishDate?: Date;

  @ApiPropertyOptional({
    description: 'Activity finish hour (optional)',
    example: '10:00',
  })
  @IsOptional()
  @IsString()
  finishHour?: string;

  @ApiPropertyOptional({
    description: 'Activity aeroline (optional)',
    example: 'Aeromexico',
  })
  @IsOptional()
  @IsString()
  aeroline?: string;

  @ApiPropertyOptional({
    description: 'Flight number (optional)',
    example: 'AM-123',
  })
  @IsOptional()
  @IsString()
  flight?: string;

  @ApiPropertyOptional({
    description: 'Activity route (optional)',
    example: 'CDMX - Cancun',
  })
  @IsOptional()
  @IsString()
  route?: string;

  @ApiProperty({
    description: 'Activity order to be displayed',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  order: number;

  constructor(dayNumber: number, activity: string, order: number) {
    this.dayNumber = dayNumber;
    this.activity = activity;
    this.order = order;
  }
}
