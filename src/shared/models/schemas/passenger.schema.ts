import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { AboardPoints } from './aboarpoint.schema';
import { OriginCity } from './origincity.schema';
import { Prices } from './price.schema';

@Schema()
export class Passengers {
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
  aboardPoint: AboardPoints;

  // ref: 'Price'
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Prices', required: true })
  price: Prices;

  @Prop()
  passportPhoto?: string;

  @Prop()
  visaPhoto?: string;

  @Prop()
  seat?: string;

  @Prop({ default: Date.now })
  createdAt?: Date;

  constructor(
    room: string,
    name: string,
    lastName: string,
    secondLastName: string,
    originCity: OriginCity,
    aboardPoint: AboardPoints,
    price: Prices,
  ) {
    this.room = room;
    this.name = name;
    this.lastName = lastName;
    this.secondLastName = secondLastName;
    this.originCity = originCity;
    this.aboardPoint = aboardPoint;
    this.price = price;
  }
}

export type PassengerDocument = HydratedDocument<Passengers>;
export const PassengerSchema = SchemaFactory.createForClass(Passengers);
