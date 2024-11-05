import { AboardPoints } from '@/shared/models/schemas/aboarpoint.schema';
import { Types } from 'mongoose';

export type AboardPointLean = AboardPoints & { _id: Types.ObjectId };
