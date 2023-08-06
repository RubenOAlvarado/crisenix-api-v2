import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class Roles {
  @Prop({ required: true, index: true })
  description: string;

  @Prop({ enum: ['Activo', 'Inactivo'], default: 'Activo' })
  status: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export type RolesDocument = HydratedDocument<Roles>;
export const RolesSchema = SchemaFactory.createForClass(Roles);
