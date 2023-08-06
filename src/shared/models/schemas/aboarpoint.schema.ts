import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class AboardPoint {
  @Prop({ type: String, required: true, index: true })
  name: string;

  @Prop({ type: String, enum: ['Activo', 'Inactivo'], default: 'Activo' })
  status: string;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
}

export type AboardPointDocument = HydratedDocument<AboardPoint>;
export const AboardPointSchema = SchemaFactory.createForClass(AboardPoint);
