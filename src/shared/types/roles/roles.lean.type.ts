import { Types } from 'mongoose';
import { Roles } from 'src/shared/models/schemas/roles.schema';

export type RolesLean = Roles & { _id: Types.ObjectId };
