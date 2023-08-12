import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class TranslationType {
  @Prop({ type: String, required: true, index: true })
  name: string;

  @Prop({ type: String, enum: ['Activo', 'Inactivo'], default: 'Activo' })
  status: string;

  @Prop({ type: Date, default: Date.now })
  createdAt?: Date;

  constructor(name: string, status: string) {
    this.name = name;
    this.status = status;
  }
}

export type TranslationTypeDocument = HydratedDocument<TranslationType>;
export const TranslationTypeSchema =
  SchemaFactory.createForClass(TranslationType);
