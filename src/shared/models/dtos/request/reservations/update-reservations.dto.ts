import { PartialType } from '@nestjs/swagger';
import { CreateReservationsDTO } from './create-reservations.dto';

export class UpdateReservationsDto extends PartialType(CreateReservationsDTO) {}
