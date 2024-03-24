import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ResponseWebUserDTO } from '../user/response-webuser.dto';
import { ResponsePassengerDTO } from '../passenger/response-passenger.dto';
import { SalesStatus } from '@/shared/enums/sales/salesstatus.enum';
import { ResponseTourDTO } from '../tour/responsetour.dto';

export class ResponseSalesDTO {
  @ApiProperty({
    description: 'Sale tour',
  })
  tour: ResponseTourDTO;

  @ApiProperty({
    description: 'Sale status',
  })
  status: SalesStatus;

  @ApiProperty({
    description: 'Client name',
  })
  clientName: string;

  @ApiProperty({
    description: 'Client last name',
  })
  clientLastName: string;

  @ApiPropertyOptional({
    description: 'Client mother last name',
  })
  clientMotherLastName?: string;

  @ApiProperty({
    description: 'Client email',
  })
  email: string;

  @ApiProperty({
    description: 'Reserved seats',
  })
  reservedSeats: number;

  @ApiProperty({
    description: 'Reservation date',
  })
  reservationDate: Date;

  @ApiPropertyOptional({
    description: 'Pay date',
  })
  payDate?: Date;

  @ApiPropertyOptional({
    description: 'Total payed',
  })
  totalPayedMount?: number;

  @ApiPropertyOptional({
    description: 'List of passengers',
  })
  passengers?: ResponsePassengerDTO[];

  @ApiPropertyOptional({
    description: 'User if registered',
  })
  user?: ResponseWebUserDTO;

  constructor(
    tour: ResponseTourDTO,
    status: SalesStatus,
    clientName: string,
    clientLastName: string,
    email: string,
    reservedSeats: number,
    reservationDate: Date,
    payDate: Date,
    totalPayedMount: number,
    passengers: ResponsePassengerDTO[],
    user: ResponseWebUserDTO,
  ) {
    this.tour = tour;
    this.status = status;
    this.clientName = clientName;
    this.clientLastName = clientLastName;
    this.email = email;
    this.reservedSeats = reservedSeats;
    this.reservationDate = reservationDate;
    this.payDate = payDate;
    this.totalPayedMount = totalPayedMount;
    this.passengers = passengers;
    this.user = user;
  }
}
