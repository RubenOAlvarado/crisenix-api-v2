import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({
  timestamps: true,
})
export class PrivateTours {
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
  children?: number;

  @Prop({ required: true })
  tourDescription: string;

  constructor(
    name: string,
    phone: string,
    email: string,
    destination: string,
    origin: string,
    initDate: string,
    returnDate: string,
    adults: number,
    tourDescription: string,
  ) {
    this.name = name;
    this.phone = phone;
    this.email = email;
    this.destination = destination;
    this.origin = origin;
    this.initDate = initDate;
    this.returnDate = returnDate;
    this.adults = adults;
    this.tourDescription = tourDescription;
  }
}

export type PrivateTourDocument = HydratedDocument<PrivateTours>;
export const PrivateTourSchema = SchemaFactory.createForClass(PrivateTours);
