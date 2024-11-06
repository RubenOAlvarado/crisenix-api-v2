import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Status } from '@/shared/enums/status.enum';

@Schema({
  timestamps: true,
})
export class OriginCities {
  @Prop({ required: true, index: true, type: String })
  state: string;

  @Prop({ required: true, index: true, type: String })
  name: string;

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
