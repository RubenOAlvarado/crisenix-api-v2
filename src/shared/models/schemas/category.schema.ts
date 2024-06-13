import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { SubCategories } from './subCategory.schema';

@Schema()
export class Categories {
  @Prop({ required: true, index: true })
  label: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SubCategories' }],
  })
  subCategories: Array<SubCategories>;

  @Prop({ enum: ['Activo', 'Inactivo'], default: 'Activo' })
  status: string;

  @Prop({ default: Date.now })
  createdAt?: Date;

  constructor(
    label: string,
    status: string,
    subCategories: Array<SubCategories>,
  ) {
    this.label = label;
    this.status = status;
    this.subCategories = subCategories;
  }
}

export type CategoryDocument = HydratedDocument<Categories>;
export const CategorySchema = SchemaFactory.createForClass(Categories);
