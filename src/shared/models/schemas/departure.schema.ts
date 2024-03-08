import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class Departures {
  @Prop({ required: true })
  terminal: string;

  @Prop({ required: true })
  aeroline: string;

  @Prop({ required: true })
  route: string;

  @Prop({ required: true })
  gate: string;

  @Prop({ required: true })
  flight: string;

  @Prop({ required: true })
  hour: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ default: Date.now })
  createdAt?: Date;

  constructor(
    terminal: string,
    aeroline: string,
    route: string,
    gate: string,
    flight: string,
    hour: string,
    date: Date,
  ) {
    this.terminal = terminal;
    this.aeroline = aeroline;
    this.route = route;
    this.gate = gate;
    this.flight = flight;
    this.hour = hour;
    this.date = date;
  }
}

export type DepartureDocument = HydratedDocument<Departures>;
export const DepartureSchema = SchemaFactory.createForClass(Departures);
