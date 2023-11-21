import { Types } from 'mongoose';
import { Categories } from '../../models/schemas/category.schema';

export type CategoryLean = Categories & { _id: Types.ObjectId };
