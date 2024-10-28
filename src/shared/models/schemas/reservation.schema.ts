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

  @Prop({ enum: ['MXN', 'USD'], required: true })
  currency: string;

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
  user: User;

  @Prop({ required: true })
  totalSeats: number;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Passengers' }] })
  passenger?: Array<Passengers>;

  @Prop({ default: Date.now })
  createdAt?: Date;

  constructor(
    status: string,
    currency: string,
    tour: Tours,
    user: User,
    totalSeats: number,
  ) {
    this.status = status;
    this.currency = currency;
    this.tour = tour;
    this.user = user;
    this.totalSeats = totalSeats;
  }
}
export type ReservationDocument = HydratedDocument<Reservations>;
export const ReservationSchema = SchemaFactory.createForClass(Reservations);
