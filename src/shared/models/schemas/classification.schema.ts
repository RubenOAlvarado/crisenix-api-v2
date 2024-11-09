import { Status } from '@/shared/enums/status.enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({
  timestamps: true,
})
export class Classifications {
  @Prop({ required: true, index: true, type: String })
  name: string;

  @Prop({ required: false, type: String })
  description?: string;

  @Prop({ enum: Status, default: Status.ACTIVE, required: true })
  status: Status;

  constructor(name: string, status: Status) {
    this.name = name;
    this.status = status;
  }
}

export type ClassificationsDocument = HydratedDocument<Classifications>;
export const ClassificationSchema =
  SchemaFactory.createForClass(Classifications);
