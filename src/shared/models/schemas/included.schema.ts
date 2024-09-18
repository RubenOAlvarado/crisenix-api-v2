import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Entries } from './entry.schema';

@Schema()
export class Includeds {
  @Prop({ required: true, index: true })
  concept: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Entries',
  })
  entry: Entries;

  @Prop({ enum: ['Activo', 'Inactivo'], default: 'Activo' })
  status: string;

  @Prop({ default: Date.now })
  createdAt?: Date;

  constructor(concept: string, entry: Entries, status: string) {
    this.concept = concept;
    this.entry = entry;
    this.status = status;
  }
}

export type IncludedDocument = HydratedDocument<Includeds>;
export const IncludedSchema = SchemaFactory.createForClass(Includeds);
