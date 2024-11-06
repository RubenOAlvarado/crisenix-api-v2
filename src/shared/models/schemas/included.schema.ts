import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Entries } from './entry.schema';
import { Status } from '@/shared/enums/status.enum';

@Schema({
  timestamps: true,
})
export class IncludedServices {
  @Prop({ required: true, index: true, type: String })
  concept: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Entries',
    required: true,
  })
  entry: Entries;

  @Prop({ enum: Status, default: Status.ACTIVE, required: true })
  status: Status;

  constructor(concept: string, entry: Entries, status: Status) {
    this.concept = concept;
    this.entry = entry;
    this.status = status;
  }
}

export type IncludedServicesDocument = HydratedDocument<IncludedServices>;
export const IncludedServicesSchema =
  SchemaFactory.createForClass(IncludedServices);
