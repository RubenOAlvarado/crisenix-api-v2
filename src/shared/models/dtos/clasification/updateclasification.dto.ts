import { PartialType } from '@nestjs/swagger';
import { CreateClasificationDTO } from './createclasification.dto';

export class UpdateClasificationDTO extends PartialType(
  CreateClasificationDTO,
) {}
