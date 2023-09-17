import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { TranslationTypes } from './translationtype.schema';

@Schema()
export class Transports {
  @Prop({ required: true, index: true })
  name: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TranslationTypes',
    required: true,
  })
  translationType: TranslationTypes;

  @Prop({ enum: ['Activo', 'Inactivo'], default: 'Activo' })
  status: string;

  @Prop({ default: Date.now })
  createdAt?: Date;

  constructor(name: string, translationType: TranslationTypes, status: string) {
    this.name = name;
    this.translationType = translationType;
    this.status = status;
  }
}

export type TransportsDocument = HydratedDocument<Transports>;
export const TransportsSchema = SchemaFactory.createForClass(Transports);
