import { Status } from '@/shared/enums/status.enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({
  timestamps: true,
})
export class Categories {
  @Prop({ required: true, index: true })
  label: string;

  @Prop()
  main?: string;

  @Prop({ enum: Status, default: Status.ACTIVE, required: true })
  status: Status;

  constructor(label: string, status: Status) {
    this.label = label;
    this.status = status;
  }
}

export type CategoryDocument = HydratedDocument<Categories>;
export const CategorySchema = SchemaFactory.createForClass(Categories);
