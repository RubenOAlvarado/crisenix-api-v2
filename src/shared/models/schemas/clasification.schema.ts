import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class Clasifications {
  @Prop({ required: true, index: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ enum: ['Activo', 'Inactivo'], default: 'Activo' })
  status: string;

  @Prop({ default: Date.now })
  createdAt?: Date;

  constructor(name: string, status: string) {
    this.name = name;
    this.status = status;
  }
}

export type ClasificationDocument = HydratedDocument<Clasifications>;
export const ClasificationSchema = SchemaFactory.createForClass(Clasifications);
