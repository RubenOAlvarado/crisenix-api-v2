import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { TransferTypes } from './transfertype.schema';
import { Status } from '@/shared/enums/status.enum';

@Schema({
  timestamps: true,
})
export class Transports {
  @Prop({ required: true, index: true })
  name: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TransferTypes',
    required: true,
  })
  transferType: TransferTypes;

  @Prop({ enum: Status, default: Status.ACTIVE, required: true })
  status: Status;

  constructor(name: string, transferType: TransferTypes, status: Status) {
    this.name = name;
    this.transferType = transferType;
    this.status = status;
  }
}

export type TransportsDocument = HydratedDocument<Transports>;
export const TransportsSchema = SchemaFactory.createForClass(Transports);
