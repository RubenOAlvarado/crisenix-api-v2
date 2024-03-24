import { PartialType } from '@nestjs/swagger';
import { CreateTourTypeDTO } from './createTourType.dto';

export class UpdateTourTypeDTO extends PartialType(CreateTourTypeDTO) {}
