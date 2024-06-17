import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Categories } from './category.schema';
import { OriginCity } from './origincity.schema';
import { TransferTypes } from './transfertype.schema';
import { Prices } from './price.schema';

@Schema()
export class Destinations {
  @Prop({ type: String, required: true, index: true, unique: true })
  code: string;

  @Prop({ type: String, required: true, index: true })
  name: string;

  @Prop({ type: String })
  description?: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Categories' }] })
  categories?: Array<Categories>;

  @Prop({ type: String, enum: ['Activo', 'Inactivo'], default: 'Activo' })
  status: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'OriginCity' }] })
  originCities?: Array<OriginCity>;

  @Prop({ type: String })
  tentativeDates?: string;

  @Prop({ type: Boolean, default: false })
  passport?: boolean;

  @Prop({ type: String, enum: ['Cliente', 'Crisenix', 'N/A'], default: 'N/A' })
  visa: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TransferTypes' }],
  })
  transferTypes?: Array<TransferTypes>;

  @Prop({ type: String })
  transfer?: string;

  @Prop({ type: Array })
  photos?: Array<string>;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Prices',
    required: true,
  })
  price: Prices;

  @Prop({ type: Date, default: Date.now })
  createdAt?: Date;

  constructor(
    code: string,
    name: string,
    status: string,
    visa: string,
    price: Prices,
  ) {
    this.code = code;
    this.name = name;
    this.status = status;
    this.visa = visa;
    this.price = price;
  }
}

export type DestinationDocument = HydratedDocument<Destinations>;
export const DestinationSchema = SchemaFactory.createForClass(Destinations);
