import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { SalerType } from './salertype.schema';

@Schema()
export class Saler {
  @Prop({ required: true, index: true })
  code: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  lastName: string;

  @Prop()
  secondLastName: string;

  // reference to SalerType
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SalerType',
  })
  salerType: SalerType;

  @Prop({ enum: ['Activo', 'Inactivo'], default: 'Activo' })
  status: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export type SalerDocument = HydratedDocument<Saler>;
export const SalerSchema = SchemaFactory.createForClass(Saler);
