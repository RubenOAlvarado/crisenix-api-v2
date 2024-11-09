import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Destinations } from './destination.schema';
import { AboardPoints } from './aboarpoint.schema';
import { TourTypes } from './tourtype.schema';
import { Transports } from './transports.schema';
import { Prices } from './price.schema';
import { TourStatus } from '@/shared/enums/tour/status.enum';
import { IncludedServices } from './included.schema';
import { ItineraryActivities } from './itineraryActivities.schema';

@Schema({
  timestamps: true,
})
export class Tours {
  @Prop({
    type: Types.ObjectId,
    ref: 'Destinations',
    required: true,
  })
  destination: Destinations | Types.ObjectId;

  @Prop({ type: String, required: true, index: true, unique: true })
  code: string;

  @Prop({
    type: String,
    enum: TourStatus,
    default: TourStatus.ACTIVE,
    required: true,
  })
  status: TourStatus;

  @Prop({ type: Number, required: true })
  seats: number;

  @Prop({ type: Number, required: false })
  availableSeats?: number;

  @Prop({ type: Number, default: 0 })
  ocuppiedSeats: number;

  @Prop({ type: Date, required: true, index: true })
  startDate: Date;

  @Prop({ type: Array, required: false })
  aboardHours?: Array<{
    hour: string;
    aboardPoint: AboardPoints | Types.ObjectId;
  }>;

  @Prop({ type: Number, default: 1, required: true })
  days: number;

  @Prop({ type: Number, default: 0, required: true })
  nights: number;

  @Prop({
    type: Types.ObjectId,
    ref: 'Transports',
    required: true,
  })
  transport: Transports | Types.ObjectId;

  @Prop({ type: Date, required: true })
  endDate: Date;

  @Prop({ type: Array, required: false })
  returnHours?: Array<{
    hour: string;
    aboardPoint: AboardPoints | Types.ObjectId;
  }>;

  @Prop({ type: Array, required: false })
  coordinators?: Array<{
    transport: string;
    name: string;
    phone: string;
  }>;

  @Prop({ type: String, required: false })
  front?: string;

  @Prop({ type: String, required: false })
  recommendations?: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'TourTypes',
    required: true,
  })
  tourType: TourTypes | Types.ObjectId;

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'IncludedServices' }],
    required: false,
  })
  includedServices?: Array<IncludedServices>;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Prices' }], required: true })
  prices?: Array<Prices>;

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'ItineraryActivities' }],
    required: false,
  })
  itinerary?: Array<ItineraryActivities>;

  constructor(
    destination: Destinations | Types.ObjectId,
    code: string,
    status: TourStatus,
    seats: number,
    startDate: Date,
    transport: Transports | Types.ObjectId,
    endDate: Date,
    tourType: TourTypes | Types.ObjectId,
    availableSeats: number,
    ocuppiedSeats: number,
    days: number,
    nights: number,
  ) {
    this.destination = destination;
    this.code = code;
    this.status = status;
    this.seats = seats;
    this.startDate = startDate;
    this.transport = transport;
    this.endDate = endDate;
    this.tourType = tourType;
    this.availableSeats = availableSeats;
    this.ocuppiedSeats = ocuppiedSeats;
    this.days = days;
    this.nights = nights;
  }
}

export type TourDocument = HydratedDocument<Tours>;
export const TourSchema = SchemaFactory.createForClass(Tours);

TourSchema.pre('save', function (next) {
  if (this.isNew && !this.availableSeats) {
    this.availableSeats = this.seats;
  }
  next();
});
