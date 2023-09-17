import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { SalerTypes } from './salertype.schema';

@Schema()
export class Salers {
  @Prop({ required: true, index: true })
  code: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  lastName: string;

  @Prop()
  secondLastName?: string;

  // reference to SalerType
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SalerTypes',
  })
  salerType: SalerTypes;

  @Prop({ enum: ['Activo', 'Inactivo'], default: 'Activo' })
  status: string;

  @Prop({ default: Date.now })
  createdAt?: Date;

  constructor(
    code: string,
    name: string,
    lastName: string,
    salerType: SalerTypes,
    status: string,
  ) {
    this.code = code;
    this.name = name;
    this.lastName = lastName;
    this.salerType = salerType;
    this.status = status;
  }
}

export type SalerDocument = HydratedDocument<Salers>;
export const SalerSchema = SchemaFactory.createForClass(Salers);
