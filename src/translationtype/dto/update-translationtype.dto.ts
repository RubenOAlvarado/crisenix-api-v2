import { PartialType } from '@nestjs/mapped-types';
import { CreateTranslationtypeDto } from './create-translationtype.dto';

export class UpdateTranslationtypeDto extends PartialType(
  CreateTranslationtypeDto,
) {}
