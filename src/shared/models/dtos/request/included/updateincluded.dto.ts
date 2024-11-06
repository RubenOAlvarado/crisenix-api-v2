import { PartialType } from '@nestjs/swagger';
import { CreateIncludedServiceDTO } from './createincluded.dto';

export class UpdateIncludedServiceDTO extends PartialType(
  CreateIncludedServiceDTO,
) {}
