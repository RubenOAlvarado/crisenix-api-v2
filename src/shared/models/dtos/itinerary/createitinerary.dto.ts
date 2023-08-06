import {
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateItineraryDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  activity: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsMongoId()
  clasification?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  status?: string;
}
