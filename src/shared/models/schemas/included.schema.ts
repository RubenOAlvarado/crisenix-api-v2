import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class Included {
  @Prop({ required: true, index: true })
  concept: string;

  @Prop({ required: true, index: true })
  included: string;

  @Prop({ required: true, index: true })
  publish: string;

  @Prop({
    enum: [
      'Transporte Aéreo',
      'Hospedaje',
      'Alimentos',
      'Actividades',
      'Gastos',
      'Traslados',
      'Visitas',
      'Servicios',
      'Recorrido',
    ],
    required: true,
    index: true,
  })
  entry: string;

  @Prop({ required: true, index: true })
  city: string;

  @Prop({ required: true, index: true })
  hotel: string;

  @Prop({
    enum: ['Tentativo', 'Previsto', 'Definitivo'],
    required: true,
    index: true,
  })
  hotelStatus: string;

  @Prop({ required: true, index: true })
  address: string;

  @Prop({ required: true, index: true })
  phone: string;

  @Prop({ required: true, index: true })
  nights: number;

  @Prop({ required: true, index: true })
  checkIn: Date;

  @Prop({ required: true, index: true })
  checkOut: Date;

  @Prop({ required: true, index: true })
  single: number;

  @Prop({ required: true, index: true })
  singleBase: number;

  @Prop({ required: true, index: true })
  doubleBase: number;

  @Prop({ required: true, index: true })
  tripleBase: number;

  @Prop({ required: true, index: true })
  quadrupleBase: number;

  @Prop({ required: true, index: true })
  minor: number;

  @Prop({ required: true, index: true })
  inapam: number;

  @Prop({ enum: ['Activo', 'Inactivo'], default: 'Activo' })
  status: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export type IncludedDocument = HydratedDocument<Included>;
export const IncludedSchema = SchemaFactory.createForClass(Included);
