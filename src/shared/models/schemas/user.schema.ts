import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

@Schema()
export class User {
  @Prop({ required: true, index: true })
  firebaseUid: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  lastName: string;

  @Prop()
  secondLast: string;

  @Prop()
  phone: string;

  @Prop({ default: 'Activo' })
  status: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop()
  deletedAt: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Roles' })
  role: string;
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);
