import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Tours } from './tour.schema';
import { User } from './user.schema';
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
    type: Types.ObjectId,
    ref: 'Tours',
    required: true,
  })
  tour: Tours | Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
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
    type: String,
  })
  clientName?: string;

  @Prop({
    validate: {
      validator: function (this: Reservations, value: string | undefined) {
        return this.user != null || (value != null && value.trim().length > 0);
      },
      message: 'Client last name is required when user is not provided',
    },
    type: String,
  })
  clientLastName?: string;

  @Prop({
    validate: {
      validator: function (this: Reservations, value: string | undefined) {
        return this.user != null || (value != null && value.trim().length > 0);
      },
      message: 'Client mother last name is required when user is not provided',
    },
    type: String,
  })
  clientMotherLastName?: string;

  @Prop({
    validate: {
      validator: function (this: Reservations, value: string | undefined) {
        return this.user != null || (value != null && value.trim().length > 0);
      },
      message: 'Client email is required when user is not provided',
    },
    type: String,
  })
  clientEmail?: string;

  @Prop({ type: Number, required: true })
  totalSeats: number;

  @Prop({ required: true, type: Date })
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
