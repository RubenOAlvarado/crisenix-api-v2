import { Reservations } from '@/shared/models/schemas/reservation.schema';
import { Types } from 'mongoose';

export type ReservationsLean = Reservations & { _id: Types.ObjectId };
