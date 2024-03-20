import { Departures } from '@/shared/models/schemas/departure.schema';
import { Types } from 'mongoose';

export type DepartureLean = Departures & { _id: Types.ObjectId };
