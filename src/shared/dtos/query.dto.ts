import { IntersectionType } from '@nestjs/swagger';
import { PaginationDTO } from './pagination.dto';
import { StatusDTO } from './statusparam.dto';
import { SubCatalogDto } from './searcher/destination/subCatalog.dto';

export class QueryDTO extends IntersectionType(
  PaginationDTO,
  StatusDTO,
  SubCatalogDto,
) {}
