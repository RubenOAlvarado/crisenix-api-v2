import { TransportTypes } from '@/shared/models/schemas/transporttype.schema';
import { Types } from 'mongoose';

export type TransportTypeLean = TransportTypes & { _id: Types.ObjectId };
