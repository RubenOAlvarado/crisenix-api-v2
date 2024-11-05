import { IntersectionType } from '@nestjs/swagger';
import { PaginationDTO } from './pagination.dto';
import { StatusDTO } from './statusparam.dto';
import { FetchOptionsDto } from './fetchOptions.dto';

export class QueryDTO extends IntersectionType(
  PaginationDTO,
  StatusDTO,
  FetchOptionsDto,
) {}
