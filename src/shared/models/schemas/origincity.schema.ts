import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { AboardPoints } from './aboarpoint.schema';
import { Status } from '@/shared/enums/status.enum';

@Schema({
  timestamps: true,
})
export class OriginCities {
  @Prop({ required: true, index: true })
  state: string;

  @Prop({ required: true, index: true })
  name: string;

  // ref: 'AboardPoint'
  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'AboardPoints' }],
  })
  aboardPoints?: Array<AboardPoints>;

  @Prop({ enum: Status, default: Status.ACTIVE, required: true })
  status: Status;

  constructor(state: string, name: string, status: Status) {
    this.state = state;
    this.name = name;
    this.status = status;
  }
}

export type OriginCityDocument = HydratedDocument<OriginCities>;
export const OriginCitySchema = SchemaFactory.createForClass(OriginCities);
