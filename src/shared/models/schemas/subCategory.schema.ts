import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class SubCategories {
  @Prop({ required: true, index: true })
  label: string;

  @Prop({ enum: ['Activo', 'Inactivo'], default: 'Activo' })
  status: string;

  @Prop({ default: Date.now })
  createdAt?: Date;

  constructor(label: string, status: string) {
    this.label = label;
    this.status = status;
  }
}

export type SubCategoryDocument = HydratedDocument<SubCategories>;
export const SubCategorySchema = SchemaFactory.createForClass(SubCategories);
