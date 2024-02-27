import { ApiProperty } from '@nestjs/swagger';
import { TourStatus } from '../../tour/status.enum';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class ChangeTourStatusDTO {
  @ApiProperty({
    description: 'Tour status to change.',
    enum: TourStatus,
  })
  @IsNotEmpty()
  @IsString()
  @IsEnum(TourStatus)
  newStatus: TourStatus;

  constructor(newStatus: TourStatus) {
    this.newStatus = newStatus;
  }
}
