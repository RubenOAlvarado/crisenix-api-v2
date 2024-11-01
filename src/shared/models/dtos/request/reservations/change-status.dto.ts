import { ReservationStatus } from '@/shared/enums/reservation-status.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsMongoId, IsNotEmpty } from 'class-validator';

export class ChangeStatusDTO {
  @ApiProperty({
    description: 'Reservation status',
    enum: ReservationStatus,
    default: ReservationStatus.RESERVED,
  })
  @IsEnum(ReservationStatus)
  @IsNotEmpty()
  status: ReservationStatus;

  @ApiProperty({
    description: 'Reservation ID',
    example: '60f4b3b3b3b3b3b3b3b3b3',
  })
  @IsNotEmpty()
  @IsMongoId()
  id: string;

  constructor(status: ReservationStatus, id: string) {
    this.status = status;
    this.id = id;
  }
}
