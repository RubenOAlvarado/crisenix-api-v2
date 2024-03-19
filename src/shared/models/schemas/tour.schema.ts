import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Destinations } from './destination.schema';
import { Transports } from './transporst.schema';
import { AboardPoints } from './aboarpoint.schema';
import { Departures } from './departure.schema';
import { TourTypes } from './tourtype.schema';
import { Includeds } from './included.schema';
import { Prices } from './price.schema';
import { Itineraries } from './itinerary.schema';

@Schema()
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

  @Prop({ type: Array, default: [] })
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

  @Prop({ type: Array, default: [] })
  returnHour?: Array<{ hour: string; aboardPoint: AboardPoints }>;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Departures' }] })
  departure?: Array<Departures>;

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
    ref: 'TourTypes',
    required: true,
  })
  tourType: TourTypes;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Includeds' }] })
  included?: Array<Includeds>;

  @Prop({ type: Array })
  itinerary?: Array<{
    dayNumber: number;
    activity: Itineraries;
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

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Prices' }] })
  price?: Array<Prices>;

  @Prop({ type: Date, default: Date.now })
  createdAt?: Date;

  constructor(
    destination: Destinations,
    code: string,
    status: string,
    boxLunch: string,
    seating: number,
    initDate: Date,
    days: number,
    nights: number,
    transport: Transports,
    returnDate: Date,
    tourType: TourTypes,
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

export type TourDocument = HydratedDocument<Tours>;
export const TourSchema = SchemaFactory.createForClass(Tours);
