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
    description: 'Activity clasification',
    example: 'camping',
  })
  @IsNotEmpty()
  @IsMongoId()
  clasification: string;

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

  @ApiProperty({
    description: 'Activity order to be displayed',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  order: number;

  constructor(dayNumber: number, clasification: string, order: number) {
    this.dayNumber = dayNumber;
    this.clasification = clasification;
    this.order = order;
  }
}
