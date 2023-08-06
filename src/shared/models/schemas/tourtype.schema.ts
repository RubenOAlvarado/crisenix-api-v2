import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class TourType {
  @Prop({ required: true, index: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ enum: ['Activo', 'Inactivo'], default: 'Activo' })
  status: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export type TourTypeDocument = HydratedDocument<TourType>;
export const TourTypeSchema = SchemaFactory.createForClass(TourType);
