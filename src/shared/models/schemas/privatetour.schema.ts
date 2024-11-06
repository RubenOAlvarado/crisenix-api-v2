import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({
  timestamps: true,
})
export class PrivateTours {
  @Prop({ required: true, type: String })
  name: string;

  @Prop({ required: true, type: String })
  phone: string;

  @Prop({ required: true, type: String })
  email: string;

  @Prop({ required: true, type: String })
  destination: string;

  @Prop({ required: true, type: String })
  origin: string;

  @Prop({ required: true, type: String })
  initDate: string;

  @Prop({ required: true, type: String })
  returnDate: string;

  @Prop({ required: true, type: Number })
  adults: number;

  @Prop({ type: Number, required: false })
  childrens?: number;

  @Prop({ required: true, type: String })
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
