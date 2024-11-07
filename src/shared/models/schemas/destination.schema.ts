import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Categories } from './category.schema';
import { Status } from '@/shared/enums/status.enum';

@Schema({
  timestamps: true,
})
export class Destinations {
  @Prop({ type: String, required: true, index: true, unique: true })
  code: string;

  @Prop({ type: String, required: true, index: true })
  name: string;

  @Prop({ type: String, required: false })
  description?: string;

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'Categories' }],
    required: false,
  })
  categories?: Array<Categories>;

  @Prop({ enum: Status, default: Status.ACTIVE, required: true })
  status: Status;

  @Prop({ type: String, required: false })
  tentativeDates?: string;

  @Prop({ type: String, required: false })
  transfer?: string;

  @Prop({ type: Array, required: false })
  photos?: Array<string>;

  constructor(code: string, name: string, status: Status) {
    this.code = code;
    this.name = name;
    this.status = status;
  }
}

export type DestinationDocument = HydratedDocument<Destinations>;
export const DestinationSchema = SchemaFactory.createForClass(Destinations);
