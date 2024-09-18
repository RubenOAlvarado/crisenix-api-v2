import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export class Entries {
  @Prop({
    enum: [
      'Alimentos',
      'Actividades',
      'Gastos',
      'Traslados',
      'Visitas',
      'Servicios',
      'Recorrido',
    ],
    required: true,
  })
  description: string;

  @Prop({ enum: ['Activo', 'Inactivo'], default: 'Activo' })
  status: string;

  @Prop({ default: Date.now })
  createdAt?: Date;

  constructor(description: string, status: string) {
    this.description = description;
    this.status = status;
  }
}

export type EntryDocument = HydratedDocument<Entries>;
export const EntrySchema = SchemaFactory.createForClass(Entries);
