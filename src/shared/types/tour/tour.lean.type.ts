import { Tours } from '@/shared/models/schemas/tour.schema';
import { Types } from 'mongoose';

export type TourLean = Tours & { _id: Types.ObjectId };
