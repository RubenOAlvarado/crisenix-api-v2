import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Clasifications } from './clasification.schema';

@Schema()
export class Itinerary {
  @Prop({ required: true })
  activity: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Clasifications',
    required: true,
  })
  clasification: Clasifications;

  @Prop({ enum: ['Activo', 'Inactivo'], default: 'Activo' })
  status: string;

  @Prop({ default: Date.now })
  createdAt?: Date;

  constructor(activity: string, clasification: Clasifications, status: string) {
    this.activity = activity;
    this.clasification = clasification;
    this.status = status;
  }
}

export type ItineraryDocument = HydratedDocument<Itinerary>;
export const ItinerarySchema = SchemaFactory.createForClass(Itinerary);
