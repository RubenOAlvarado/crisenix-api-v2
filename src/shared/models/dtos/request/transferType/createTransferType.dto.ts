import { OmitType } from '@nestjs/swagger';
import { CreateCatalogDTO } from '../catalogs/createCatalog.dto';

export class CreateTransferTypeDTO extends OmitType(CreateCatalogDTO, [
  'description',
] as const) {}
