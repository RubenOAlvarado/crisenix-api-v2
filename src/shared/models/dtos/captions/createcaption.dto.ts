import { OmitType } from '@nestjs/swagger';
import { CreateCatalogDTO } from '../catalogs/createCatalog.dto';

export class CreateCaptionDTO extends OmitType(CreateCatalogDTO, [
  'description',
] as const) {}
