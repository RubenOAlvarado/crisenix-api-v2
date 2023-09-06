import { OmitType } from '@nestjs/swagger';
import { QueryDTO } from './query.dto';

export class PaginationDTO extends OmitType(QueryDTO, ['status'] as const) {}
