import { Permissions } from '@/shared/enums/permissions.enum';
import { UserRoles } from '@/shared/enums/roles';
import { Status } from '@/shared/enums/status.enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({
  timestamps: true,
})
export class Roles {
  @Prop({ required: true, index: true, type: String, enum: UserRoles })
  description: UserRoles;

  @Prop({ enum: Status, default: Status.ACTIVE, required: true })
  status: Status;

  @Prop({ type: [String], required: true, enum: Object.values(Permissions) })
  permissions: Permissions[];

  constructor(
    description: UserRoles,
    status: Status,
    permissions: Permissions[],
  ) {
    this.description = description;
    this.status = status;
    this.permissions = permissions;
  }
}

export type RolesDocument = HydratedDocument<Roles>;
export const RolesSchema = SchemaFactory.createForClass(Roles);
