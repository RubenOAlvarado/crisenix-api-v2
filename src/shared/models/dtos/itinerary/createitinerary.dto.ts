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
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  activity: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsMongoId()
  clasification?: string;

  @ApiPropertyOptional({ enum: Status })
  @IsOptional()
  @IsString()
  status?: Status;

  constructor(activity: string) {
    this.activity = activity;
  }
}
