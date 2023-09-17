import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { SalerTypes } from './salertype.schema';
import { TourType } from './tourtype.schema';

@Schema()
export class Commissions {
  // ref: 'SalerType',
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SalerTypes',
    required: true,
  })
  salerType: SalerTypes;

  // ref: 'TourType',
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TourType',
    required: true,
  })
  tourType: TourType;

  @Prop({ required: true })
  amount: number;

  @Prop({ enum: ['Activo', 'Inactivo'], default: 'Activo' })
  status: string;

  @Prop({ default: Date.now })
  createdAt?: Date;

  constructor(
    salerType: SalerTypes,
    tourType: TourType,
    amount: number,
    status: string,
  ) {
    this.salerType = salerType;
    this.tourType = tourType;
    this.amount = amount;
    this.status = status;
  }
}

export type CommissionsDocument = HydratedDocument<Commissions>;
export const CommissionsSchema = SchemaFactory.createForClass(Commissions);
