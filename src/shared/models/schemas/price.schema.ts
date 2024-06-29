import { Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Destinations } from './destination.schema';
import { OriginCities } from './origincity.schema';

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
    ref: 'OriginCities',
    required: true,
  })
  city: OriginCities;

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
  status?: string;

  @Prop({ default: Date.now })
  createdAt?: Date;

  constructor(destination: Destinations, city: OriginCities, currency: string) {
    this.destination = destination;
    this.city = city;
    this.currency = currency;
  }
}

export type PricesDocument = HydratedDocument<Prices>;
export const PricesSchema = SchemaFactory.createForClass(Prices);
PricesSchema.set('strict', false);
