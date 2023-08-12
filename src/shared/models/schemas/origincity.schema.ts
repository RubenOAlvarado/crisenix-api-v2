import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { AboardPoint } from './aboarpoint.schema';

@Schema()
export class OriginCity {
  @Prop({ required: true, index: true })
  state: string;

  @Prop({ required: true, index: true })
  name: string;

  // ref: 'AboardPoint'
  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'AboardPoint' }],
  })
  aboardPoints?: Array<AboardPoint>;

  @Prop({ enum: ['Activo', 'Inactivo'], default: 'Activo' })
  status: string;

  @Prop({ default: Date.now })
  createdAt?: Date;

  constructor(state: string, name: string, status: string) {
    this.state = state;
    this.name = name;
    this.status = status;
  }
}

export type OriginCityDocument = HydratedDocument<OriginCity>;
export const OriginCitySchema = SchemaFactory.createForClass(OriginCity);
