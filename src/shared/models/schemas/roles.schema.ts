import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class Roles {
  @Prop({ required: true, index: true })
  description: string;

  @Prop({ enum: ['Activo', 'Inactivo'], default: 'Activo' })
  status: string;

  @Prop({ type: Object })
  permissions?: object;

  @Prop({ default: Date.now })
  createdAt?: Date;

  constructor(description: string, status: string, permissions?: object) {
    this.description = description;
    this.status = status;
    this.permissions = permissions;
  }
}

export type RolesDocument = HydratedDocument<Roles>;
export const RolesSchema = SchemaFactory.createForClass(Roles);
