import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Categories } from './category.schema';
import { OriginCities } from './origincity.schema';
import { TransferTypes } from './transfertype.schema';
import { Status } from '@/shared/enums/status.enum';
import { Visa } from '@/shared/enums/visa.enum';

@Schema({
  timestamps: true,
})
export class Destinations {
  @Prop({ type: String, required: true, index: true, unique: true })
  code: string;

  @Prop({ type: String, required: true, index: true })
  name: string;

  @Prop({ type: String })
  description?: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Categories' }] })
  categories?: Array<Categories>;

  @Prop({ enum: Status, default: Status.ACTIVE, required: true })
  status: Status;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'OriginCities' }],
  })
  originCities?: Array<OriginCities>;

  @Prop({ type: String })
  tentativeDates?: string;

  @Prop({ type: Boolean, default: false })
  passport?: boolean;

  @Prop({ type: String, enum: Visa, default: Visa.NO })
  visa: Visa;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TransferTypes' }],
  })
  transferTypes?: Array<TransferTypes>;

  @Prop({ type: String })
  transfer?: string;

  @Prop({ type: Array })
  photos?: Array<string>;

  constructor(code: string, name: string, status: Status, visa: Visa) {
    this.code = code;
    this.name = name;
    this.status = status;
    this.visa = visa;
  }
}

export type DestinationDocument = HydratedDocument<Destinations>;
export const DestinationSchema = SchemaFactory.createForClass(Destinations);
