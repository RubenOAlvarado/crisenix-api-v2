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
  originCity: OriginCities | Types.ObjectId;

  @Prop({ required: true, enum: Currency, default: Currency.MXN })
  currency: Currency;

  @Prop({ required: false, type: Number })
  generalPrice?: number;

  @Prop({ required: false, type: Number })
  singleBasePrice?: number;

  @Prop({ required: false, type: Number })
  doubleBasePrice?: number;

  @Prop({ required: false, type: Number })
  tripleBasePrice?: number;

  @Prop({ required: false, type: Number })
  quadrupleBasePrice?: number;

  @Prop({ required: false, type: Number })
  minorPrice?: number;

  @Prop({ required: false, type: Number })
  inapamPrice?: number;

  @Prop({ enum: Status, default: Status.ACTIVE, required: true })
  status: Status;

  constructor(originCity: OriginCities, currency: Currency, status: Status) {
    this.originCity = originCity;
    this.currency = currency;
    this.status = status;
  }
}

export type PricesDocument = HydratedDocument<Prices>;
export const PricesSchema = SchemaFactory.createForClass(Prices);
