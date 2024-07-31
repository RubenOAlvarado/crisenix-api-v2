import { TransferTypes } from '@/shared/models/schemas/transfertype.schema';
import { Types } from 'mongoose';

export type TransferTypeLean = TransferTypes & { _id: Types.ObjectId };
