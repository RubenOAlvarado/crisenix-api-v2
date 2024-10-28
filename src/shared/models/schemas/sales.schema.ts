import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Reservations } from './reservation.schema';

@Schema()
export class Sales {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reservations',
    required: true,
  })
  reservation: Reservations;

  @Prop({ required: true })
  total: number;

  @Prop({ enum: ['MXN', 'USD'], required: true, default: 'MXN' })
  currency: string;

  @Prop()
  paymentDate: Date;

  @Prop({ enum: ['PENDING', 'PAID'], default: 'PENDING' })
  status: string;

  @Prop()
  declinedReason?: string;

  @Prop({ default: Date.now })
  createdAt?: Date;

  constructor(
    reservation: Reservations,
    total: number,
    currency: string,
    paymentDate: Date,
    status: string,
  ) {
    this.reservation = reservation;
    this.total = total;
    this.currency = currency;
    this.paymentDate = paymentDate;
    this.status = status;
  }
}

export type SalesDocument = HydratedDocument<Sales>;
export const SalesSchema = SchemaFactory.createForClass(Sales);
