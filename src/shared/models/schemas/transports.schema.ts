import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Status } from '@/shared/enums/status.enum';
import { TransportTypes } from './transporttype.schema';

@Schema({
  timestamps: true,
})
export class Transports {
  @Prop({ required: true, index: true, type: String })
  name: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'TransportTypes',
    required: true,
  })
  transportType: TransportTypes | Types.ObjectId;

  @Prop({ enum: Status, default: Status.ACTIVE, required: true })
  status: Status;

  constructor(name: string, transportType: TransportTypes, status: Status) {
    this.name = name;
    this.transportType = transportType;
    this.status = status;
  }
}

export type TransportsDocument = HydratedDocument<Transports>;
export const TransportsSchema = SchemaFactory.createForClass(Transports);
