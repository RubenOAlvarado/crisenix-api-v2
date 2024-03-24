import { PartialType } from '@nestjs/swagger';
import { CreateTranslationTypeDTO } from './createTranslationType.dto';

export class UpdateTranslationTypeDTO extends PartialType(
  CreateTranslationTypeDTO,
) {}
