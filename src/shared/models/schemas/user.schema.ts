import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Roles } from './roles.schema';

@Schema()
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

  @Prop({ enum: ['Activo', 'Inactivo'], default: 'Activo' })
  status: string;

  @Prop({ default: Date.now })
  createdAt?: Date;

  @Prop()
  deletedAt?: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Roles' })
  role?: Roles;

  constructor(
    firebaseUid: string,
    name: string,
    lastName: string,
    status: string,
  ) {
    this.firebaseUid = firebaseUid;
    this.name = name;
    this.lastName = lastName;
    this.status = status;
  }
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);
