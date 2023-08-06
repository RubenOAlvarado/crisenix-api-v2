import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class PrivateTour {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  destination: string;

  @Prop({ required: true })
  origin: string;

  @Prop({ required: true })
  initDate: string;

  @Prop({ required: true })
  returnDate: string;

  @Prop({ required: true })
  adults: number;

  @Prop()
  children: number;

  @Prop({ required: true })
  tourDescription: string;
}

export type PrivateTourDocument = HydratedDocument<PrivateTour>;
export const PrivateTourSchema = SchemaFactory.createForClass(PrivateTour);
