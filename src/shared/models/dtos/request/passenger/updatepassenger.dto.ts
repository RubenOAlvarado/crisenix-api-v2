import { PartialType } from '@nestjs/swagger';
import { CreatePassengerDTO } from './createpassenger.dto';

export class UpdatePassengerDTO extends PartialType(CreatePassengerDTO) {}
