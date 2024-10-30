import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Roles } from './roles.schema';
import { Status } from '@/shared/enums/status.enum';

@Schema({
  timestamps: true,
})
export class User {
  @Prop({ required: true, index: true })
  firebaseUid: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  lastName: string;

  @Prop()
  secondLast?: string;

  @Prop()
  phone?: string;

  @Prop({ enum: Status, default: Status.ACTIVE, required: true })
  status: Status;

  @Prop()
  deletedAt?: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Roles' })
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
