import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Roles } from './roles.schema';
import { Status } from '@/shared/enums/status.enum';

@Schema({
  timestamps: true,
})
export class User {
  @Prop({ required: true, index: true, type: String })
  firebaseUid: string;

  @Prop({ required: true, type: String })
  name: string;

  @Prop({ required: true, type: String })
  lastName: string;

  @Prop({ type: String, required: false })
  secondLast?: string;

  @Prop({ type: String, required: false })
  phone?: string;

  @Prop({ enum: Status, default: Status.ACTIVE, required: true })
  status: Status;

  @Prop({
    type: Date,
    default: null,
    required: false,
  })
  deletedAt?: Date;

  @Prop({ type: Types.ObjectId, ref: 'Roles', required: true })
  role: Roles;

  constructor(
    firebaseUid: string,
    name: string,
    lastName: string,
    status: Status,
    role: Roles,
  ) {
    this.firebaseUid = firebaseUid;
    this.name = name;
    this.lastName = lastName;
    this.status = status;
    this.role = role;
  }
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);
