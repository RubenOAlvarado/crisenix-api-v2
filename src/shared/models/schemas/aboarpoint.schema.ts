import { Status } from '@/shared/enums/status.enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { OriginCities } from './origincity.schema';

@Schema({
  timestamps: true,
})
export class AboardPoints {
  @Prop({ type: String, required: true, index: true })
  name: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'OriginCities',
    required: true,
  })
  originCity: OriginCities | Types.ObjectId;

  @Prop({ type: String, enum: Status, default: Status.ACTIVE })
  status: Status;

  constructor(name: string, originCity: OriginCities, status: Status) {
    this.name = name;
    this.originCity = originCity;
    this.status = status;
  }
}

export type AboardPointDocument = HydratedDocument<AboardPoints>;
export const AboardPointSchema = SchemaFactory.createForClass(AboardPoints);
