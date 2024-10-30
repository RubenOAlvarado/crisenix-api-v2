import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Entries } from './entry.schema';
import { Status } from '@/shared/enums/status.enum';

@Schema({
  timestamps: true,
})
export class Includeds {
  @Prop({ required: true, index: true })
  concept: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Entries',
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

export type IncludedDocument = HydratedDocument<Includeds>;
export const IncludedSchema = SchemaFactory.createForClass(Includeds);
