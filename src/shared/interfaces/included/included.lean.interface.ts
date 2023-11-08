import { Includeds } from '@/shared/models/schemas/included.schema';
import { Types } from 'mongoose';

export type IncludedLean = Includeds & { _id: Types.ObjectId };
