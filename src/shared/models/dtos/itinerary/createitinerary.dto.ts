import {
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Status } from '@/shared/enums/status.enum';

export class CreateItineraryDTO {
  @ApiProperty({
    type: String,
    description: 'Activity to do in the itinerary.',
    example: 'Visit the Eiffel Tower',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  activity: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Clasification of the itinerary.',
    example: '5f6d1d0f6b6b2e1f6c5d1e0f',
  })
  @IsOptional()
  @IsMongoId()
  clasification?: string;

  @ApiPropertyOptional({
    enum: Status,
    description: 'Status of the itinerary.',
    example: Status.ACTIVE,
  })
  @IsOptional()
  @IsString()
  status?: Status;

  constructor(activity: string) {
    this.activity = activity;
  }
}
