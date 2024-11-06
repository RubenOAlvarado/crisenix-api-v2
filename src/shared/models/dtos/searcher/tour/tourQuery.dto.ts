import { IntersectionType } from '@nestjs/swagger';
import { PaginationDTO } from '../pagination.dto';
import { FetchOptionsDto } from '../fetchOptions.dto';

export class TourQueryDTO extends IntersectionType(
  PaginationDTO,
  FetchOptionsDto,
) {}
