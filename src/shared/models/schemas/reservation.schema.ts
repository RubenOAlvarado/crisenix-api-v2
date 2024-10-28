import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Tours } from './tour.schema';
import { User } from './user.schema';
import { Passengers } from './passenger.schema';

@Schema()
export class Reservations {
  @Prop({
    enum: ['RESERVADA', 'PAGADA', 'COMPROBADA', 'CANCELADA', 'RECHAZADA'],
    required: true,
  })
  status: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tours',
    required: true,
  })
  tour: Tours;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  user?: User;

  @Prop()
  clientName?: string;

  @Prop()
  clientLastName?: string;

  @Prop()
  clientMotherLastName?: string;

  @Prop()
  clientEmail?: string;

  @Prop({ required: true })
  totalSeats: number;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Passengers' }] })
  passengers?: Array<Passengers>;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop()
  paymentDeadline: Date;

  constructor(
    status: string,
    tour: Tours,
    totalSeats: number,
    createdAt: Date,
    paymentDeadline: Date,
  ) {
    this.status = status;
    this.tour = tour;
    this.totalSeats = totalSeats;
    this.createdAt = createdAt;
    this.paymentDeadline = paymentDeadline;
  }
}
export type ReservationDocument = HydratedDocument<Reservations>;
export const ReservationSchema = SchemaFactory.createForClass(Reservations);
