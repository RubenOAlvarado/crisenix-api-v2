import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { AboardPoint } from './aboarpoint.schema';
import { OriginCity } from './origincity.schema';
import { Price } from './price.schema';

@Schema()
export class Passenger {
  @Prop({ required: true, index: true })
  room: string;

  @Prop({ required: true, index: true })
  name: string;

  @Prop({ required: true, index: true })
  lastName: string;

  @Prop({ required: true, index: true })
  secondLastName: string;

  // ref: 'OriginCity'
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'OriginCity',
    required: true,
  })
  originCity: OriginCity;

  // ref: 'AboardPoint'
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AboardPoint',
    required: true,
  })
  aboardPoint: AboardPoint;

  // ref: 'Price'
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Price', required: true })
  price: Price;

  @Prop({})
  passportPhoto: string;

  @Prop({})
  visaPhoto: string;

  @Prop()
  seat: string;

  @Prop({ default: Date.now, index: true })
  createdAt: Date;
}

export type PassengerDocument = HydratedDocument<Passenger>;
export const PassengerSchema = SchemaFactory.createForClass(Passenger);
