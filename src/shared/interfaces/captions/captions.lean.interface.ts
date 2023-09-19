import { Captions } from '@/shared/models/schemas/captions.schema';
import { Types } from 'mongoose';

export type CaptionsLean = Captions & { _id: Types.ObjectId };
