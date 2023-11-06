import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ResponseWebUserDTO } from '../user/response-webuser.dto';
import { ResponsePassengerDTO } from '../passenger/response-passenger.dto';
import { ResponseSalerDto } from '../saler/response-saler.dto';
import { SalesStatus } from '@/shared/enums/sales/salesstatus.enum';
import { ResponseTourDTO } from '../tour/responsetour.dto';
import { SaleOrigin } from '@/shared/enums/sales/saleorigin.enum';

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
    description: 'Sale origin platform',
  })
  origin: SaleOrigin;

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
    description: 'Client id (url)',
  })
  oficialId: string;

  @ApiProperty({
    description: 'Reserved seats',
  })
  reservedSeats: number;

  @ApiProperty({
    description: 'Reservation date',
  })
  reservationDate: Date;

  @ApiPropertyOptional({
    description: 'Pay limit date',
  })
  payLimitDate?: Date;

  @ApiPropertyOptional({
    description: 'Pay date',
  })
  payDate?: Date;

  @ApiPropertyOptional({
    description: 'Total payed',
  })
  totalPayedMount?: number;

  @ApiPropertyOptional({
    description: 'Saler',
  })
  saler?: ResponseSalerDto;

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
    origin: SaleOrigin,
    clientName: string,
    clientLastName: string,
    email: string,
    oficialId: string,
    reservedSeats: number,
    reservationDate: Date,
    payLimitDate: Date,
    payDate: Date,
    totalPayedMount: number,
    saler: ResponseSalerDto,
    passengers: ResponsePassengerDTO[],
    user: ResponseWebUserDTO,
  ) {
    this.tour = tour;
    this.status = status;
    this.origin = origin;
    this.clientName = clientName;
    this.clientLastName = clientLastName;
    this.email = email;
    this.oficialId = oficialId;
    this.reservedSeats = reservedSeats;
    this.reservationDate = reservationDate;
    this.payLimitDate = payLimitDate;
    this.payDate = payDate;
    this.totalPayedMount = totalPayedMount;
    this.saler = saler;
    this.passengers = passengers;
    this.user = user;
  }
}
