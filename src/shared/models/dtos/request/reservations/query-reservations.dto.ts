import { PaginationDTO } from '@/shared/models/dtos/searcher/pagination.dto';
import { ReservationStatus } from '@/shared/enums/reservation-status.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class QueryReservationStatusDTO extends PaginationDTO {
  @ApiProperty({
    description: 'Reservation status',
    enum: ReservationStatus,
    default: ReservationStatus.RESERVED,
  })
  @IsEnum(ReservationStatus)
  @IsNotEmpty()
  status!: ReservationStatus;
}
