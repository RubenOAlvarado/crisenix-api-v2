import { IncludedServices } from '@/shared/models/schemas/included.schema';
import { Types } from 'mongoose';

export type IncludedLean = IncludedServices & { _id: Types.ObjectId };
