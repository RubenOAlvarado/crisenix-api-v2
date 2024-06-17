import { Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { OriginCity } from './origincity.schema';
import { Destinations } from './destination.schema';

export class Prices {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Destinations',
    required: true,
  })
  destination: Destinations;
  // ref: 'OriginCity'
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'OriginCity',
    required: true,
  })
  city: OriginCity;

  @Prop({ required: true, enum: ['MXN', 'USD'], default: 'MXN' })
  currency: string;

  @Prop()
  general?: number;

  @Prop()
  singleBase?: number;

  @Prop()
  doubleBase?: number;

  @Prop()
  tripleBase?: number;

  @Prop()
  quadrupleBase?: number;

  @Prop()
  minor?: number;

  @Prop()
  inapam?: number;

  @Prop({ enum: ['Activo', 'Inactivo'], default: 'Activo' })
  status: string;

  @Prop({ default: Date.now })
  createdAt?: Date;

  constructor(
    destination: Destinations,
    city: OriginCity,
    currency: string,
    general: number,
    singleBase: number,
    doubleBase: number,
    tripleBase: number,
    quadrupleBase: number,
    minor: number,
    inapam: number,
    status: string,
  ) {
    this.destination = destination;
    this.city = city;
    this.currency = currency;
    this.general = general;
    this.singleBase = singleBase;
    this.doubleBase = doubleBase;
    this.tripleBase = tripleBase;
    this.quadrupleBase = quadrupleBase;
    this.minor = minor;
    this.inapam = inapam;
    this.status = status;
  }
}

export type PricesDocument = HydratedDocument<Prices>;
export const PricesSchema = SchemaFactory.createForClass(Prices);
