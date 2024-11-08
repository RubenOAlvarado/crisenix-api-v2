import { Status } from '@/shared/enums/status.enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema({
  timestamps: true,
})
export class Categories {
  @Prop({ required: true, index: true })
  label: string;

  @Prop({ type: Types.ObjectId, ref: 'Category', default: null })
  parentCategory?: Types.ObjectId | null;

  @Prop({ type: Boolean, default: false, required: true })
  isRootCategory: boolean;

  @Prop({ enum: Status, default: Status.ACTIVE, required: true })
  status: Status;

  constructor(
    label: string,
    status: Status,
    isRootCategory: boolean,
    parentCategory?: Types.ObjectId | null,
  ) {
    this.label = label;
    this.status = status;
    this.isRootCategory = isRootCategory;
    this.parentCategory = parentCategory;
  }
}

export type CategoryDocument = HydratedDocument<Categories>;
export const CategorySchema = SchemaFactory.createForClass(Categories);
