import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class EventLog {
  @Prop()
  serviceId: string;

  @Prop()
  service: string;

  @Prop({
    enum: [
      'Alta',
      'Baja',
      'Cambio',
      'Cancelacion',
      'Cierre',
      'Publicacion',
      'Conclusion',
    ],
  })
  move: string;

  @Prop()
  user: string;

  @Prop({ default: Date.now })
  timestamp: Date;

  @Prop({ type: Object })
  registry: any;
}

export type EventLogDocument = HydratedDocument<EventLog>;
export const EventLogSchema = SchemaFactory.createForClass(EventLog);
