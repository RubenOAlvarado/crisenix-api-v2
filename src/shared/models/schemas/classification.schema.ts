import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class Classifications {
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

export type ClassificationsDocument = HydratedDocument<Classifications>;
export const ClassificationSchema =
  SchemaFactory.createForClass(Classifications);
