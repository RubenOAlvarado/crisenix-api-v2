import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { TranslationType } from './translationtype.schema';

@Schema()
export class Transports {
  @Prop({ required: true, index: true })
  name: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TranslationType',
    required: true,
  })
  translationType: TranslationType;

  @Prop({ enum: ['Activo', 'Inactivo'], default: 'Activo' })
  status: string;

  @Prop({ default: Date.now })
  createdAt?: Date;

  constructor(name: string, translationType: TranslationType, status: string) {
    this.name = name;
    this.translationType = translationType;
    this.status = status;
  }
}

export type TransportsDocument = HydratedDocument<Transports>;
export const TransportsSchema = SchemaFactory.createForClass(Transports);
