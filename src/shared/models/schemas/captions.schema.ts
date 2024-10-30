import { Status } from '@/shared/enums/status.enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({
  timestamps: true,
})
export class Captions {
  @Prop({ type: String, required: true, index: true })
  name: string;

  @Prop({ type: String, enum: Status, default: Status.ACTIVE })
  status: Status;

  constructor(name: string, status: Status) {
    this.name = name;
    this.status = status;
  }
}

export type CaptionDocument = HydratedDocument<Captions>;
export const CaptionSchema = SchemaFactory.createForClass(Captions);
