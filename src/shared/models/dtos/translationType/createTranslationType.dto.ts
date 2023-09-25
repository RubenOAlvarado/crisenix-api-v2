import { OmitType } from '@nestjs/swagger';
import { CreateCatalogDTO } from '../catalogs/createCatalog.dto';

export class CreateTranslationTypeDTO extends OmitType(CreateCatalogDTO, [
  'description',
] as const) {}
