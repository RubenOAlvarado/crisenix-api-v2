import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Categories } from './category.schema';
import { OriginCity } from './origincity.schema';
import { TranslationTypes } from './translationtype.schema';

@Schema()
export class Destinations {
  @Prop({ type: String, required: true, index: true, unique: true })
  code: string;

  @Prop({ type: String, required: true, index: true })
  name: string;

  @Prop({ type: String })
  description?: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Categories' }] })
  category?: Array<Categories>;

  @Prop({ type: String, enum: ['Activo', 'Inactivo'], default: 'Activo' })
  status: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'OriginCity' }] })
  originCity?: Array<OriginCity>;

  @Prop({ type: String })
  tentativeDates?: string;

  @Prop({ type: Boolean, default: false })
  passport?: boolean;

  @Prop({ type: String, enum: ['Cliente', 'Crisenix', 'N/A'], default: 'N/A' })
  visa: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TranslationTypes' }],
  })
  translationType?: Array<TranslationTypes>;

  @Prop({ type: String })
  translationRoute?: string;

  @Prop({ type: Array })
  photos?: Array<string>;

  @Prop({ type: Date, default: Date.now })
  createdAt?: Date;

  constructor(code: string, name: string, status: string, visa: string) {
    this.code = code;
    this.name = name;
    this.status = status;
    this.visa = visa;
  }
}

export type DestinationDocument = HydratedDocument<Destinations>;
export const DestinationSchema = SchemaFactory.createForClass(Destinations);
