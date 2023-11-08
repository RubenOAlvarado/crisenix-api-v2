import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class Includeds {
  @Prop({ required: true, index: true })
  concept: string;

  @Prop({ required: true })
  included: string;

  @Prop({ required: true })
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
  })
  entry: string;

  @Prop()
  city?: string;

  @Prop()
  hotel?: string;

  @Prop({
    enum: ['Tentativo', 'Previsto', 'Definitivo'],
    index: true,
  })
  hotelStatus?: string;

  @Prop()
  address?: string;

  @Prop()
  phone?: string;

  @Prop()
  nights?: number;

  @Prop()
  checkIn?: Date;

  @Prop()
  checkOut?: Date;

  @Prop()
  single?: number;

  @Prop()
  singleBase?: number;

  @Prop()
  doubleBase?: number;

  @Prop()
  tripleBase?: number;

  @Prop()
  quadrupleBase?: number;

  @Prop()
  minor?: number;

  @Prop()
  inapam?: number;

  @Prop({ enum: ['Activo', 'Inactivo'], default: 'Activo' })
  status: string;

  @Prop({ default: Date.now })
  createdAt?: Date;

  constructor(
    concept: string,
    included: string,
    publish: string,
    entry: string,
    status: string,
  ) {
    this.concept = concept;
    this.included = included;
    this.publish = publish;
    this.entry = entry;
    this.status = status;
  }
}

export type IncludedDocument = HydratedDocument<Includeds>;
export const IncludedSchema = SchemaFactory.createForClass(Includeds);
