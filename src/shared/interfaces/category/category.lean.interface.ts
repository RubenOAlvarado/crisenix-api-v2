import { Types } from 'mongoose';
import { Category } from '../../models/schemas/category.schema';

export type CategoryLean = Category & { _id: Types.ObjectId };
