import { ReservationStatus } from '@/shared/enums/reservation-status.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class ChangeStatusDTO {
  @ApiProperty({
    description: 'Reservation status',
    enum: ReservationStatus,
    default: ReservationStatus.RESERVED,
  })
  @IsEnum(ReservationStatus)
  @IsNotEmpty()
  status: ReservationStatus;

  constructor(status: ReservationStatus) {
    this.status = status;
  }
}
