import { Types } from 'mongoose';
import { OriginCity } from '../../models/schemas/origincity.schema';

export type OriginCityLean = OriginCity & { _id: Types.ObjectId };
