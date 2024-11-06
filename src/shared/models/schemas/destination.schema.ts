import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Categories } from './category.schema';
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

  @Prop({ type: String, required: false })
  description?: string;

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'Categories' }],
    required: false,
  })
  categories?: Array<Categories>;

  @Prop({ enum: Status, default: Status.ACTIVE, required: true })
  status: Status;

  @Prop({ type: String, required: false })
  tentativeDates?: string;

  @Prop({ type: Boolean, default: false, required: false })
  passport?: boolean;

  @Prop({ type: String, enum: Visa, default: Visa.NO, required: true })
  visa: Visa;

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'TransferTypes' }],
    required: false,
  })
  transferTypes?: Array<TransferTypes>;

  @Prop({ type: String, required: false })
  transfer?: string;

  @Prop({ type: Array, required: false })
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
