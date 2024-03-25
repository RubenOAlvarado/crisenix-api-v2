import { ResponseWebUserDTO } from '../user/response-webuser.dto';
import { ResponsePassengerDTO } from '../passenger/response-passenger.dto';
import { SalesStatus } from '@/shared/enums/sales/salesstatus.enum';
import { Expose, Type } from 'class-transformer';
import { Types } from 'mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ResponseSalesDTO {
  @ApiPropertyOptional()
  @Expose()
  _id?: Types.ObjectId;

  @ApiProperty()
  @Expose()
  tour: string;

  @ApiProperty()
  @Expose()
  status: SalesStatus;

  @ApiProperty()
  @Expose()
  clientName: string;

  @ApiProperty()
  @Expose()
  clientLastName: string;

  @ApiPropertyOptional()
  @Expose()
  clientMotherLastName?: string;

  @ApiProperty()
  @Expose()
  email: string;

  @ApiProperty()
  @Expose()
  reservedSeat: number;

  @ApiProperty()
  @Expose()
  reservationDate: Date;

  @ApiPropertyOptional()
  @Expose()
  payDate?: Date;

  @ApiPropertyOptional()
  @Expose()
  totalPayedMount?: number;

  @ApiPropertyOptional({
    type: ResponsePassengerDTO,
    isArray: true,
  })
  @Expose()
  passengers?: ResponsePassengerDTO[];

  @ApiPropertyOptional()
  @Type(() => ResponseWebUserDTO)
  @Expose()
  user?: ResponseWebUserDTO;

  constructor(
    tour: string,
    status: SalesStatus,
    clientName: string,
    clientLastName: string,
    email: string,
    reservedSeat: number,
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
    this.reservedSeat = reservedSeat;
    this.reservationDate = reservationDate;
    this.payDate = payDate;
    this.totalPayedMount = totalPayedMount;
    this.passengers = passengers;
    this.user = user;
  }
}
