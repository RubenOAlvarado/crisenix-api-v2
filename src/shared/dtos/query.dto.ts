import { IntersectionType } from '@nestjs/swagger';
import { PaginationDTO } from './pagination.dto';
import { StatusDTO } from './statusparam.dto';

export class QueryDTO extends IntersectionType(PaginationDTO, StatusDTO) {}
