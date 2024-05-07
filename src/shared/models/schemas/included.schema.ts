import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Lodging } from './lodging.schema';

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
  lodging?: Lodging;

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
