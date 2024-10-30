import { Status } from '@/shared/enums/status.enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({
  timestamps: true,
})
export class AboardPoints {
  @Prop({ type: String, required: true, index: true })
  name: string;

  @Prop({ type: String, enum: Status, default: Status.ACTIVE })
  status: Status;

  constructor(name: string, status: Status) {
    this.name = name;
    this.status = status;
  }
}

export type AboardPointDocument = HydratedDocument<AboardPoints>;
export const AboardPointSchema = SchemaFactory.createForClass(AboardPoints);
