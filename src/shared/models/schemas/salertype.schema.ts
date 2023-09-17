import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class SalerTypes {
  @Prop({ required: true, index: true })
  description: string;

  @Prop({ enum: ['Activo', 'Inactivo'], default: 'Activo' })
  status: string;

  @Prop({ default: Date.now })
  createdAt?: Date;

  constructor(description: string, status: string) {
    this.description = description;
    this.status = status;
  }
}

export type SalerTypeDocument = HydratedDocument<SalerTypes>;
export const SalerTypeSchema = SchemaFactory.createForClass(SalerTypes);
