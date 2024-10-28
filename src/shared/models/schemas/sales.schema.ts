import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import type { TourLean } from '@/shared/interfaces/tour/tour.lean.interface';
import { Reservations } from './reservation.schema';

@Schema()
export class Sales {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Tours', required: true })
  tour: TourLean;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reservations',
    required: true,
  })
  reservation: Reservations;

  @Prop({ required: true })
  total: number;

  @Prop({ required: true })
  paymentDeadline: Date;

  @Prop()
  payDate?: Date;

  @Prop({ default: Date.now })
  createdAt?: Date;

  constructor(
    tour: TourLean,
    reservation: Reservations,
    total: number,
    paymentDeadline: Date,
  ) {
    this.tour = tour;
    this.reservation = reservation;
    this.total = total;
    this.paymentDeadline = paymentDeadline;
  }
}

export type SalesDocument = HydratedDocument<Sales>;
export const SalesSchema = SchemaFactory.createForClass(Sales);
