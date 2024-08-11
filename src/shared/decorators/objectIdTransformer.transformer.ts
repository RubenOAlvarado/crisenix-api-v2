import { Transform } from 'class-transformer';
import { Types } from 'mongoose';

export function ObjectIdToString() {
  return Transform((value) => {
    console.log(value);
    return value instanceof Types.ObjectId ? value.toString() : value;
  });
}
