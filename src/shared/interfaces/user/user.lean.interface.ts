import { User } from '@/shared/models/schemas/user.schema';
import { Types } from 'mongoose';

export type UserLean = User & { _id: Types.ObjectId };
