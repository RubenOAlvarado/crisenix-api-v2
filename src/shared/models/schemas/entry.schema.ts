import { Entry } from '@/shared/enums/entry.enum';
import { Status } from '@/shared/enums/status.enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({
  timestamps: true,
})
export class Entries {
  @Prop({
    enum: Entry,
    required: true,
    default: Entry.SERVICIOS,
  })
  description: Entry;

  @Prop({ enum: Status, default: Status.ACTIVE, required: true })
  status: Status;

  constructor(description: Entry, status: Status) {
    this.description = description;
    this.status = status;
  }
}

export type EntryDocument = HydratedDocument<Entries>;
export const EntrySchema = SchemaFactory.createForClass(Entries);
