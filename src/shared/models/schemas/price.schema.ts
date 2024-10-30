import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Destinations } from './destination.schema';
import { OriginCities } from './origincity.schema';
import { Currency } from '@/shared/enums/currency.enum';
import { Status } from '@/shared/enums/status.enum';

@Schema({
  timestamps: true,
})
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

  @Prop({ required: true, enum: Currency, default: Currency.MXN })
  currency: Currency;

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

  @Prop({ enum: Status, default: Status.ACTIVE, required: true })
  status: Status;

  constructor(
    destination: Destinations,
    city: OriginCities,
    currency: Currency,
    status: Status,
  ) {
    this.destination = destination;
    this.city = city;
    this.currency = currency;
    this.status = status;
  }
}

export type PricesDocument = HydratedDocument<Prices>;
export const PricesSchema = SchemaFactory.createForClass(Prices);
