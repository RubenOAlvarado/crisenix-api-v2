import { PartialType } from '@nestjs/swagger';
import { CreateTourDTO } from './createtour.dto';

export class UpdateTourDTO extends PartialType(CreateTourDTO) {}
