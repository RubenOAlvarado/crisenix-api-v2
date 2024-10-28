import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Reservations } from './reservation.schema';
import { AboardPoints } from './aboarpoint.schema';

@Schema()
export class Passengers {
  @Prop({ required: true, index: true })
  name: string;

  @Prop({ required: true, index: true })
  lastName: string;

  @Prop({ required: true, index: true })
  secondLastName: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AboardPoints',
    required: true,
  })
  aboardPoint: AboardPoints;

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

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reservations',
    required: true,
  })
  reservation: Reservations;

  @Prop({ required: true })
  cost: number;

  @Prop({ default: Date.now })
  createdAt?: Date;

  constructor(
    name: string,
    lastName: string,
    secondLastName: string,
    base: string,
    reservation: Reservations,
    aboardPoint: AboardPoints,
    cost: number,
  ) {
    this.name = name;
    this.lastName = lastName;
    this.secondLastName = secondLastName;
    this.base = base;
    this.reservation = reservation;
    this.aboardPoint = aboardPoint;
    this.cost = cost;
  }
}

export type PassengerDocument = HydratedDocument<Passengers>;
export const PassengerSchema = SchemaFactory.createForClass(Passengers);
