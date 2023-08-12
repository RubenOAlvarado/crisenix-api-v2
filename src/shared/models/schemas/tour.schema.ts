import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Destination } from './destination.schema';
import { Transports } from './transporst.schema';
import { AboardPoint } from './aboarpoint.schema';
import { Departure } from './departure.schema';
import { TourType } from './tourtype.schema';
import { Included } from './included.schema';
import { Price } from './price.schema';
import { Itinerary } from './itinerary.schema';

@Schema()
export class Tour {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Destination',
    required: true,
  })
  destination: Destination;

  @Prop({ type: String, required: true, index: true })
  code: string;

  @Prop({
    type: String,
    enum: ['Activo', 'Inactivo', 'Publicado', 'Cerrado', 'Concluido'],
    default: 'Activo',
  })
  status: string;

  @Prop({ type: String, enum: ['Sí', 'No', 'Opcional'], default: 'Opcional' })
  boxLunch: string;

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
    aboardPoint: AboardPoint;
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
  returnHour?: Array<{ hour: string; aboardPoint: AboardPoint }>;

  @Prop({ type: Array, ref: 'Departure' })
  departure?: Array<Departure>;

  @Prop({ type: Array })
  coordinator?: Array<{
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
    ref: 'TourType',
    required: true,
  })
  tourType: TourType;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Included' }] })
  included?: Array<Included>;

  @Prop({ type: Array })
  itinerary?: Array<{
    dayNumber: number;
    activity: Itinerary;
    additionalCost: number;
    initDate: Date;
    initHour: string;
    finishDate: Date;
    finishHour: string;
    aeroline: string;
    flight: string;
    route: string;
    order: number;
  }>;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Price' }] })
  price?: Array<Price>;

  @Prop({ type: Date, default: Date.now })
  createdAt?: Date;

  constructor(
    destination: Destination,
    code: string,
    status: string,
    boxLunch: string,
    seating: number,
    initDate: Date,
    days: number,
    nights: number,
    transport: Transports,
    returnDate: Date,
    tourType: TourType,
  ) {
    this.destination = destination;
    this.code = code;
    this.status = status;
    this.boxLunch = boxLunch;
    this.seating = seating;
    this.initDate = initDate;
    this.days = days;
    this.nights = nights;
    this.transport = transport;
    this.returnDate = returnDate;
    this.tourType = tourType;
  }
}

export type TourDocument = HydratedDocument<Tour>;
export const TourSchema = SchemaFactory.createForClass(Tour);
