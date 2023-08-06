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
  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @MaxLength(2)
  dayNumber: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsMongoId()
  activity: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @MaxLength(6)
  additionalCost?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsDateString()
  initDate?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  initHour?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  finishDate?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  finishHour?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  aeroline?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  flight?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  route?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  order: number;
}
