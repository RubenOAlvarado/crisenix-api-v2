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
    required: true,
  })
  aboardPoints: Array<AboardPoint>;

  @Prop({ enum: ['Activo', 'Inactivo'], required: true, index: true })
  status: string;

  @Prop({ required: true, index: true })
  createdAt: Date;
}

export type OriginCityDocument = HydratedDocument<OriginCity>;
export const OriginCitySchema = SchemaFactory.createForClass(OriginCity);
