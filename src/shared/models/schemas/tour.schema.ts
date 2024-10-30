import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Destinations } from './destination.schema';
import { AboardPoints } from './aboarpoint.schema';
import { TourTypes } from './tourtype.schema';
import { Includeds } from './included.schema';
import { Classifications } from './classification.schema';
import { Transports } from './transports.schema';
import { Prices } from './price.schema';
import { TourStatus } from '@/shared/enums/tour/status.enum';

@Schema({
  timestamps: true,
})
export class Tours {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
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
  seating: number;

  @Prop({ type: Number })
  availableSeat?: number;

  @Prop({ type: Number })
  ocuppiedSeat?: number;

  @Prop({ type: Date, required: true, index: true })
  initDate: Date;

  @Prop({ type: Array })
  aboardHour?: Array<{
    hour: string;
    aboardPoint: AboardPoints;
  }>;

  @Prop({ type: Number, default: 1 })
  days: number;

  @Prop({ type: Number, default: 0 })
  nights: number;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transports',
    required: true,
  })
  transport: Transports;

  @Prop({ type: Date, required: true })
  returnDate: Date;

  @Prop({ type: Array })
  returnHour?: Array<{ hour: string; aboardPoint: AboardPoints }>;

  @Prop({ type: Array })
  coordinators?: Array<{
    transport: string;
    name: string;
    phone: string;
  }>;

  @Prop({ type: String })
  front?: string;

  @Prop({ type: String })
  recommendations?: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TourTypes',
    required: true,
  })
  tourType: TourTypes;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Includeds' }] })
  includeds?: Array<Includeds>;

  @Prop({ type: Array })
  itineraries?: Array<{
    dayNumber: number;
    classification: Classifications;
    name: string;
    additionalCost: number;
    initDate: Date;
    initHour: string;
    finishDate: Date;
    finishHour: string;
    order: number;
  }>;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Prices' }] })
  prices: Array<Prices>;

  constructor(
    destination: Destinations,
    code: string,
    status: TourStatus,
    seating: number,
    initDate: Date,
    transport: Transports,
    returnDate: Date,
    tourType: TourTypes,
    prices: Array<Prices>,
    availableSeat?: number,
    ocuppiedSeat?: number,
    aboardHour?: Array<{ hour: string; aboardPoint: AboardPoints }>,
    days = 1,
    nights = 0,
    returnHour?: Array<{ hour: string; aboardPoint: AboardPoints }>,
    coordinators?: Array<{ transport: string; name: string; phone: string }>,
    front?: string,
    recommendations?: string,
    includeds?: Array<Includeds>,
    itineraries?: Array<{
      dayNumber: number;
      classification: Classifications;
      name: string;
      additionalCost: number;
      initDate: Date;
      initHour: string;
      finishDate: Date;
      finishHour: string;
      order: number;
    }>,
  ) {
    this.destination = destination;
    this.code = code;
    this.status = status;
    this.seating = seating;
    this.initDate = initDate;
    this.transport = transport;
    this.returnDate = returnDate;
    this.tourType = tourType;
    this.prices = prices;
    this.availableSeat = availableSeat;
    this.ocuppiedSeat = ocuppiedSeat;
    this.aboardHour = aboardHour;
    this.days = days;
    this.nights = nights;
    this.returnHour = returnHour;
    this.coordinators = coordinators;
    this.front = front;
    this.recommendations = recommendations;
    this.includeds = includeds;
    this.itineraries = itineraries;
  }
}

export type TourDocument = HydratedDocument<Tours>;
export const TourSchema = SchemaFactory.createForClass(Tours);
