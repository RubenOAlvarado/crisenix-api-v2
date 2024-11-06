import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { TourStatus } from '@/shared/enums/tour/status.enum';

export class ChangeTourStatusDTO {
  @ApiProperty({
    description: 'Tour status to change.',
    enum: TourStatus,
  })
  @IsNotEmpty()
  @IsString()
  @IsEnum(TourStatus)
  newStatus!: TourStatus;
}
