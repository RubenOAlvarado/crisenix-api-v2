import { ItineraryActivityStatus } from '@/shared/enums/itineraries/itinerary.status.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

export class CreateItineraryActivityDto {
  @ApiProperty({
    type: String,
    required: true,
    example: 'Activity Name',
    description: 'Name of the activity',
  })
  @IsNotEmpty({ message: 'Activity name is required' })
  @IsString()
  activityName!: string;

  @ApiProperty({
    type: String,
    required: true,
    example: 'Classification',
    description: 'Classification of the activity',
  })
  @IsNotEmpty({ message: 'Classification is required' })
  @IsMongoId({ message: 'Classification must be a mongoId' })
  classification!: string;

  @ApiProperty({
    type: Boolean,
    required: true,
    example: false,
    default: false,
    description: 'Has additional cost indicator',
  })
  @IsNotEmpty({ message: 'Has additional cost indicator is required' })
  hasAdditionalCost!: boolean;

  @ApiPropertyOptional({
    type: Number,
    required: false,
    example: 100,
    description: 'Additional cost of the activity',
  })
  @ValidateIf((o) => o.hasAdditionalCost)
  @IsOptional()
  @IsNumber()
  additionalCost?: number;

  @ApiProperty({
    type: Date,
    required: true,
    example: '2021-01-01',
    description: 'Start date of the activity',
  })
  @IsNotEmpty({ message: 'Start date is required' })
  startDate!: Date;

  @ApiProperty({
    type: String,
    required: true,
    example: '12:00',
    description: 'Start time of the activity',
  })
  @IsNotEmpty({ message: 'Start time is required' })
  @IsString()
  startTime!: string;

  @ApiProperty({
    type: Date,
    required: true,
    example: '2021-01-01',
    description: 'End date of the activity',
  })
  @IsNotEmpty({ message: 'End date is required' })
  endDate!: Date;

  @ApiProperty({
    type: String,
    required: true,
    example: '12:00',
    description: 'End time of the activity',
  })
  @IsNotEmpty({ message: 'End time is required' })
  @IsString()
  endTime!: string;

  @ApiProperty({
    type: String,
    required: true,
    example: ItineraryActivityStatus.ACTIVE,
    description: 'Status of the activity',
    enum: ItineraryActivityStatus,
  })
  @IsNotEmpty({ message: 'Status is required' })
  @IsEnum(ItineraryActivityStatus, { message: 'Invalid status' })
  status!: ItineraryActivityStatus;
}
