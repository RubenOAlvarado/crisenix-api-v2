import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Reservations } from './reservation.schema';
import { SalesStatus } from '@/shared/enums/sales/saleStatus.enum';
import { Currency } from '@/shared/enums/currency.enum';
import { FailureReason } from '@/shared/enums/sales/failureReason.enum';

@Schema({
  timestamps: true,
})
export class Sales {
  @Prop({
    type: Types.ObjectId,
    ref: 'Reservations',
    required: true,
  })
  reservation: Reservations;

  @Prop({
    required: true,
    validate: {
      validator: (value: number) => value >= 0,
      message: 'Total must be positive.',
    },
    type: Number,
  })
  total: number;

  @Prop({ enum: Currency, required: true, default: Currency.MXN })
  currency: Currency;

  @Prop({ required: true, type: Date })
  paymentDate: Date;

  @Prop({ enum: SalesStatus, default: SalesStatus.PENDING, required: true })
  status: SalesStatus;

  @Prop({ enum: FailureReason, required: false, default: null })
  failureReason?: FailureReason;

  constructor(
    reservation: Reservations,
    total: number,
    currency: Currency,
    paymentDate: Date,
    status: SalesStatus,
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

SalesSchema.pre('save', function (next) {
  if (this.status === SalesStatus.PAID && !this.paymentDate) {
    this.paymentDate = new Date();
  }
  next();
});
