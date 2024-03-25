import { Types } from 'mongoose';
import { Classifications } from '@/shared/models/schemas/classification.schema';

export type ClassificationLean = Classifications & { _id: Types.ObjectId };
