import { PartialType } from '@nestjs/swagger';
import { CreateCatalogDTO } from './createCatalog.dto';

export class UpdateCatalogDTO extends PartialType(CreateCatalogDTO) {}
