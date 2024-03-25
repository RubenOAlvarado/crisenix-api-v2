import { PartialType } from '@nestjs/swagger';
import { CreateClassificationDTO } from './createclassification.dto';

export class UpdateClassificationDTO extends PartialType(
  CreateClassificationDTO,
) {}
