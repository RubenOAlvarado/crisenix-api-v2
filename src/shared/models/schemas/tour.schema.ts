import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Destinations } from './destination.schema';
import { AboardPoints } from './aboarpoint.schema';
import { TourTypes } from './tourtype.schema';
import { Transports } from './transports.schema';
import { Prices } from './price.schema';
import { TourStatus } from '@/shared/enums/tour/status.enum';
import { IncludedServices } from './included.schema';

@Schema({
  timestamps: true,
})
export class Tours {
  @Prop({
    type: Types.ObjectId,
    ref: 'Destinations',
    required: true,
  })
  destination: Destinations;

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
  initDate: Date;

  @Prop({ type: Array, required: false })
  aboardHours?: Array<{
    hour: string;
    aboardPoint: AboardPoints;
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
  transport: Transports;

  @Prop({ type: Date, required: true })
  returnDate: Date;

  @Prop({ type: Array, required: false })
  returnHours?: Array<{ hour: string; aboardPoint: AboardPoints }>;

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
  tourType: TourTypes;

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'IncludedServices' }],
    required: false,
  })
  includedServices?: Array<IncludedServices>;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Prices' }], required: true })
  prices: Array<Prices>;

  constructor(
    destination: Destinations,
    code: string,
    status: TourStatus,
    seats: number,
    initDate: Date,
    transport: Transports,
    returnDate: Date,
    tourType: TourTypes,
    prices: Array<Prices>,
    availableSeats: number,
    ocuppiedSeats: number,
    days: number,
    nights: number,
    aboardHours?: Array<{ hour: string; aboardPoint: AboardPoints }>,
    returnHours?: Array<{ hour: string; aboardPoint: AboardPoints }>,
    coordinators?: Array<{ transport: string; name: string; phone: string }>,
    front?: string,
    recommendations?: string,
    includedServices?: Array<IncludedServices>,
  ) {
    this.destination = destination;
    this.code = code;
    this.status = status;
    this.seats = seats;
    this.initDate = initDate;
    this.transport = transport;
    this.returnDate = returnDate;
    this.tourType = tourType;
    this.prices = prices;
    this.availableSeats = availableSeats;
    this.ocuppiedSeats = ocuppiedSeats;
    this.aboardHours = aboardHours;
    this.days = days;
    this.nights = nights;
    this.returnHours = returnHours;
    this.coordinators = coordinators;
    this.front = front;
    this.recommendations = recommendations;
    this.includedServices = includedServices;
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
