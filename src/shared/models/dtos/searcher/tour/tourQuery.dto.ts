import { IntersectionType } from '@nestjs/swagger';
import { FetchOptionsDto } from '../fetchOptions.dto';
import { PaginatedTourDTO } from '../../response/tour/paginatedTour.dto';

export class TourQueryDTO extends IntersectionType(
  PaginatedTourDTO,
  FetchOptionsDto,
) {}
