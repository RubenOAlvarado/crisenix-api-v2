import { PartialType } from '@nestjs/swagger';
import { CreateDestinationDTO } from './createdestination.dto';

export class UpdateDestinationDTO extends PartialType(CreateDestinationDTO) {}
