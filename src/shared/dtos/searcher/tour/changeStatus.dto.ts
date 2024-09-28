import { ApiProperty } from '@nestjs/swagger';
import { TourStatus } from '../../../enums/tour/status.enum';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { UrlValidator } from '@/shared/validators/urlValidator.dto';

export class ChangeTourStatusDTO extends UrlValidator {
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
