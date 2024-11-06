import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { OriginCities } from './origincity.schema';
import { Currency } from '@/shared/enums/currency.enum';
import { Status } from '@/shared/enums/status.enum';

@Schema({
  timestamps: true,
})
export class Prices {
  @Prop({
    type: Types.ObjectId,
    ref: 'OriginCities',
    required: true,
  })
  city: OriginCities;

  @Prop({ required: true, enum: Currency, default: Currency.MXN })
  currency: Currency;

  @Prop({ required: true, type: Number })
  general?: number;

  @Prop({ required: true, type: Number })
  singleBase?: number;

  @Prop({ required: true, type: Number })
  doubleBase?: number;

  @Prop({ required: true, type: Number })
  tripleBase?: number;

  @Prop({ required: true, type: Number })
  quadrupleBase?: number;

  @Prop({ required: true, type: Number })
  minor?: number;

  @Prop({ required: true, type: Number })
  inapam?: number;

  @Prop({ enum: Status, default: Status.ACTIVE, required: true })
  status: Status;

  constructor(city: OriginCities, currency: Currency, status: Status) {
    this.city = city;
    this.currency = currency;
    this.status = status;
  }
}

export type PricesDocument = HydratedDocument<Prices>;
export const PricesSchema = SchemaFactory.createForClass(Prices);
