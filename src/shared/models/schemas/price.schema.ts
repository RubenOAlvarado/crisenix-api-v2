import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { OriginCity } from './origincity.schema';

@Schema()
export class Price {
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
  general: number;

  @Prop()
  singleBase: number;

  @Prop()
  doubleBase: number;

  @Prop()
  tripleBase: number;

  @Prop()
  quadrupleBase: number;

  @Prop()
  minor: number;

  @Prop()
  inapam: number;

  @Prop({ enum: ['Activo', 'Inactivo'], default: 'Activo' })
  status: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export type PriceDocument = HydratedDocument<Price>;
export const PriceSchema = SchemaFactory.createForClass(Price);
