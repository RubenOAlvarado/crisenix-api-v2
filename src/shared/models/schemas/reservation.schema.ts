import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Tours } from './tour.schema';

@Schema()
export class Reservations {
  @Prop({ required: true })
  price: number;

  @Prop({ enum: ['MXN', 'USD'], required: true })
  currency: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tours',
    required: true,
  })
  tour: Tours;

  @Prop({ default: Date.now })
  createdAt?: Date;

  constructor(price: number, currency: string, tour: Tours) {
    this.price = price;
    this.currency = currency;
    this.tour = tour;
  }
}
export type ReservationDocument = HydratedDocument<Reservations>;
export const ReservationSchema = SchemaFactory.createForClass(Reservations);
