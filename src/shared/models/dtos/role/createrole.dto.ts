import { OmitType } from '@nestjs/swagger';
import { CreateCatalogDTO } from '../catalogs/createCatalog.dto';

export class CreateRoleDTO extends OmitType(CreateCatalogDTO, [
  'name',
] as const) {}
