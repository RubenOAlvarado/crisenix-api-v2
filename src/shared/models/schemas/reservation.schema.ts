import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Tours } from './tour.schema';
import { User } from './user.schema';
import { Passengers } from './passenger.schema';
import { ReservationStatus } from '@/shared/enums/reservation-status.enum';

@Schema({
  timestamps: true,
})
export class Reservations {
  @Prop({
    enum: ReservationStatus,
    required: true,
  })
  status: ReservationStatus;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tours',
    required: true,
  })
  tour: Tours | Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  user?: User | Types.ObjectId;

  @Prop({
    validate: {
      validator: function (this: Reservations, value: string | undefined) {
        return this.user != null || (value != null && value.trim().length > 0);
      },
      message: 'Client name is required when user is not provided',
    },
  })
  clientName?: string;

  @Prop({
    validate: {
      validator: function (this: Reservations, value: string | undefined) {
        return this.user != null || (value != null && value.trim().length > 0);
      },
      message: 'Client last name is required when user is not provided',
    },
  })
  clientLastName?: string;

  @Prop({
    validate: {
      validator: function (this: Reservations, value: string | undefined) {
        return this.user != null || (value != null && value.trim().length > 0);
      },
      message: 'Client mother last name is required when user is not provided',
    },
  })
  clientMotherLastName?: string;

  @Prop({
    validate: {
      validator: function (this: Reservations, value: string | undefined) {
        return this.user != null || (value != null && value.trim().length > 0);
      },
      message: 'Client email is required when user is not provided',
    },
  })
  clientEmail?: string;

  @Prop({ required: true })
  totalSeats: number;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Passengers' }] })
  passengers?: Array<Passengers>;

  @Prop({ required: true })
  paymentDeadline: Date;

  constructor(
    status: ReservationStatus,
    tour: Tours,
    totalSeats: number,
    paymentDeadline: Date,
  ) {
    this.status = status;
    this.tour = tour;
    this.totalSeats = totalSeats;
    this.paymentDeadline = paymentDeadline;
  }
}
export type ReservationDocument = HydratedDocument<Reservations>;
export const ReservationSchema = SchemaFactory.createForClass(Reservations);
