import { PartialType } from '@nestjs/swagger';
import { CreateIncludedDTO } from './createincluded.dto';

export class UpdateIncludedDTO extends PartialType(CreateIncludedDTO) {}
