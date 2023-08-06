import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Clasification } from './clasification.schema';

@Schema()
export class Itinerary {
  @Prop({ required: true })
  activity: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Clasification',
    required: true,
  })
  clasification: Clasification;

  @Prop({ enum: ['Activo', 'Inactivo'], default: 'Activo' })
  status: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export type ItineraryDocument = HydratedDocument<Itinerary>;
export const ItinerarySchema = SchemaFactory.createForClass(Itinerary);
