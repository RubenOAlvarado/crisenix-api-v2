import { PartialType } from '@nestjs/swagger';
import { CreateDepartureDTO } from './createdeparture.dto';

export class UpdateDepartureDTO extends PartialType(CreateDepartureDTO) {}
