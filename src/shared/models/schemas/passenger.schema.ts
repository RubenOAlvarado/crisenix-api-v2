import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Reservations } from './reservation.schema';
import { AboardPoints } from './aboarpoint.schema';
import { PriceBase } from '@/shared/enums/priceBase.enum';

@Schema({
  timestamps: true,
})
export class Passengers {
  @Prop({ required: true, index: true, type: String })
  name: string;

  @Prop({ required: true, index: true, type: String })
  lastName: string;

  @Prop({ required: false, type: String })
  motherLastName: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'AboardPoints',
    required: true,
  })
  aboardPoint: AboardPoints | Types.ObjectId;

  @Prop({
    enum: PriceBase,
    required: true,
    default: PriceBase.GENERAL,
  })
  base: PriceBase;

  @Prop({
    type: Types.ObjectId,
    ref: 'Reservations',
    required: true,
  })
  reservation: Reservations | Types.ObjectId;

  constructor(
    name: string,
    lastName: string,
    motherLastName: string,
    base: PriceBase,
    reservation: Reservations,
    aboardPoint: AboardPoints,
  ) {
    this.name = name;
    this.lastName = lastName;
    this.motherLastName = motherLastName;
    this.base = base;
    this.reservation = reservation;
    this.aboardPoint = aboardPoint;
  }
}

export type PassengerDocument = HydratedDocument<Passengers>;
export const PassengerSchema = SchemaFactory.createForClass(Passengers);
