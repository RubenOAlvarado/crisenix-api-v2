import { Status } from '@/shared/enums/status.enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({
  timestamps: true,
})
export class Roles {
  @Prop({ required: true, index: true })
  description: string;

  @Prop({ enum: Status, default: Status.ACTIVE, required: true })
  status: Status;

  @Prop({ type: [String], required: true })
  permissions: string[];

  constructor(description: string, status: Status, permissions: string[]) {
    this.description = description;
    this.status = status;
    this.permissions = permissions;
  }
}

export type RolesDocument = HydratedDocument<Roles>;
export const RolesSchema = SchemaFactory.createForClass(Roles);
