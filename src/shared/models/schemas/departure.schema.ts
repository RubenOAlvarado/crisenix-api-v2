import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class Departure {
  @Prop({ required: true, index: true })
  terminal: string;

  @Prop({ required: true, index: true })
  aeroline: string;

  @Prop({ required: true, index: true })
  route: string;

  @Prop({ required: true, index: true })
  gate: string;

  @Prop({ required: true, index: true })
  flight: string;

  @Prop({ required: true, index: true })
  hour: string;

  @Prop({ required: true, index: true })
  date: Date;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export type DepartureDocument = HydratedDocument<Departure>;
export const DepartureSchema = SchemaFactory.createForClass(Departure);
