import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { AboardPoints } from './aboarpoint.schema';
import { OriginCities } from './origincity.schema';
import { Tours } from './tour.schema';

@Schema()
export class Passengers {
  @Prop({ required: true, index: true })
  name: string;

  @Prop({ required: true, index: true })
  lastName: string;

  @Prop({ required: true, index: true })
  secondLastName: string;

  // ref: 'OriginCity'
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'OriginCities',
    required: true,
  })
  originCity: OriginCities;

  // ref: 'AboardPoint'
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AboardPoints',
    required: true,
  })
  aboardPoint: AboardPoints;

  @Prop({ required: true })
  price: number;

  @Prop({
    enum: [
      'general',
      'singleBase',
      'doubleBase',
      'tripleBase',
      'quadrupleBase',
      'inapam',
      'minor',
    ],
    required: true,
    default: 'general',
  })
  base: string;

  @Prop({ enum: ['MXN', 'USD'], required: true })
  currency: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tours',
    required: true,
  })
  tour: Tours;

  @Prop()
  passportPhoto?: string;

  @Prop()
  visaPhoto?: string;

  @Prop({ default: Date.now })
  createdAt?: Date;

  constructor(
    name: string,
    lastName: string,
    secondLastName: string,
    originCity: OriginCities,
    aboardPoint: AboardPoints,
    price: number,
    base: string,
    currency: string,
    tour: Tours,
  ) {
    this.name = name;
    this.lastName = lastName;
    this.secondLastName = secondLastName;
    this.originCity = originCity;
    this.aboardPoint = aboardPoint;
    this.price = price;
    this.base = base;
    this.currency = currency;
    this.tour = tour;
  }
}

export type PassengerDocument = HydratedDocument<Passengers>;
export const PassengerSchema = SchemaFactory.createForClass(Passengers);
