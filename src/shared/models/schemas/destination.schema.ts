import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Category } from './category.schema';
import { OriginCity } from './origincity.schema';
import { TranslationType } from './translationtype.schema';

@Schema()
export class Destination {
  @Prop({ type: String, required: true, index: true })
  code: string;

  @Prop({ type: String, required: true, index: true })
  name: string;

  @Prop({ type: String })
  description: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }] })
  category: Array<Category>;

  @Prop({ type: String, enum: ['Activo', 'Inactivo'], default: 'Activo' })
  status: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'OriginCity' }] })
  originCity: Array<OriginCity>;

  @Prop({ type: String })
  tentativeDates: string;

  @Prop({ type: Boolean })
  passport: boolean;

  @Prop({ type: String, enum: ['Cliente', 'Crisenix', 'N/A'], default: 'N/A' })
  visa: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TranslationType' }],
  })
  translationType: Array<TranslationType>;

  @Prop({ type: String })
  translationRoute: string;

  @Prop({ type: Array })
  photos: Array<string>;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
}

export type DestinationDocument = HydratedDocument<Destination>;
export const DestinationSchema = SchemaFactory.createForClass(Destination);
