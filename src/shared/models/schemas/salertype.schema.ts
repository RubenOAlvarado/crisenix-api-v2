import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class SalerType {
  @Prop({ required: true, index: true })
  description: string;

  @Prop({ enum: ['Activo', 'Inactivo'], default: 'Activo' })
  status: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export type SalerTypeDocument = HydratedDocument<SalerType>;
export const SalerTypeSchema = SchemaFactory.createForClass(SalerType);
