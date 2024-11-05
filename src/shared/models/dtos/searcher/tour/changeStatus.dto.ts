import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { IdValidator } from '@/shared/models/dtos/validators/id.validator';
import { TourStatus } from '@/shared/enums/tour/status.enum';

export class ChangeTourStatusDTO extends IdValidator {
  @ApiProperty({
    description: 'Tour status to change.',
    enum: TourStatus,
  })
  @IsNotEmpty()
  @IsString()
  @IsEnum(TourStatus)
  newStatus: TourStatus;

  constructor(id: string, newStatus: TourStatus) {
    super(id);
    this.newStatus = newStatus;
  }
}
