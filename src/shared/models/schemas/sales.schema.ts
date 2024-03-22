import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Passengers } from './passenger.schema';
import type { TourLean } from '@/shared/interfaces/tour/tour.lean.interface';
import { User } from './user.schema';

@Schema()
export class Sales {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Tours', required: true })
  tour: TourLean;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true })
  user: User;

  @Prop({
    enum: ['RESERVADA', 'PAGADA', 'COMPROBADA', 'CANCELADA', 'RECHAZADA'],
    required: true,
  })
  status: string;

  @Prop({ required: true })
  clientName: string;

  @Prop({ required: true })
  clientLastName: string;

  @Prop()
  clientMotherLastName?: string;

  @Prop()
  email?: string;

  @Prop({ required: true })
  reservedSeat: number;

  @Prop({ required: true })
  reservationDate: Date;

  @Prop()
  totalPayedMount?: number;

  @Prop()
  payDate?: Date;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Passengers' }] })
  passenger?: Array<Passengers>;

  @Prop({ default: Date.now })
  createdAt?: Date;

  constructor(
    tour: TourLean,
    user: User,
    status: string,
    clientName: string,
    clientLastName: string,
    reservedSeat: number,
    reservationDate: Date,
  ) {
    this.tour = tour;
    this.user = user;
    this.status = status;
    this.clientName = clientName;
    this.clientLastName = clientLastName;
    this.reservedSeat = reservedSeat;
    this.reservationDate = reservationDate;
  }
}

export type SalesDocument = HydratedDocument<Sales>;
export const SalesSchema = SchemaFactory.createForClass(Sales);
