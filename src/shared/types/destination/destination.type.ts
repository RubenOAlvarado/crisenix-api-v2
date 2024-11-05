import { Destinations } from '@/shared/models/schemas/destination.schema';
import { Types } from 'mongoose';

export type DestinationLean = Destinations & { _id: Types.ObjectId };
