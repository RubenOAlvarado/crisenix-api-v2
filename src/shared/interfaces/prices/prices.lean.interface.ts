import { Prices } from '@/shared/models/schemas/price.schema';
import { Types } from 'mongoose';

export type PricesLean = Prices & { _id: Types.ObjectId };
