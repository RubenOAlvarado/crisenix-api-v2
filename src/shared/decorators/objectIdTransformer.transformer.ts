import { Transform } from 'class-transformer';
import { Types } from 'mongoose';

export function ObjectIdToString() {
  return Transform(({ value }) =>
    value instanceof Types.ObjectId ? value.toHexString() : value,
  );
}
