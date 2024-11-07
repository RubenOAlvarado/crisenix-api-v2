import { Status } from '@/shared/enums/status.enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({
  timestamps: true,
})
export class TransportTypes {
  @Prop({ type: String, required: true, index: true })
  name: string;

  @Prop({ enum: Status, default: Status.ACTIVE, required: true })
  status: Status;

  constructor(name: string, status: Status) {
    this.name = name;
    this.status = status;
  }
}

export type TransportTypesDocument = HydratedDocument<TransportTypes>;
export const TransportTypesSchema =
  SchemaFactory.createForClass(TransportTypes);
