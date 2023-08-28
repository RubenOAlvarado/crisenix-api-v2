import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class Captions {
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

export type CaptionDocument = HydratedDocument<Captions>;
export const CaptionSchema = SchemaFactory.createForClass(Captions);
