import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class Categories {
  @Prop({ required: true, index: true })
  label: string;

  @Prop()
  main?: string;

  @Prop({ enum: ['Activo', 'Inactivo'], default: 'Activo' })
  status: string;

  @Prop({ default: Date.now })
  createdAt?: Date;

  constructor(label: string, status: string) {
    this.label = label;
    this.status = status;
  }
}

export type CategoryDocument = HydratedDocument<Categories>;
export const CategorySchema = SchemaFactory.createForClass(Categories);
