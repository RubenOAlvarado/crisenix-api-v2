import { Status } from '@/shared/enums/status.enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({
  timestamps: true,
})
export class TourTypes {
  @Prop({ required: true, index: true, type: String })
  name: string;

  @Prop({ type: String, required: false })
  description?: string;

  @Prop({ enum: Status, default: Status.ACTIVE, required: true })
  status: Status;

  constructor(name: string, description: string, status: Status) {
    this.name = name;
    this.description = description;
    this.status = status;
  }
}

export type TourTypeDocument = HydratedDocument<TourTypes>;
export const TourTypeSchema = SchemaFactory.createForClass(TourTypes);
