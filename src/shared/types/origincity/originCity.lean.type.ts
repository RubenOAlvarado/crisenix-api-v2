import { Types } from 'mongoose';
import { OriginCities } from '../../models/schemas/origincity.schema';

export type OriginCityLean = OriginCities & { _id: Types.ObjectId };
