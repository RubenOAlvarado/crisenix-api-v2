import { PaginationDTO } from '@/shared/dtos/pagination.dto';
import { TourStatus } from '@/shared/enums/tour/status.enum';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PaginatedTourDTO extends PaginationDTO {
  @ApiPropertyOptional({
    default: 'Activo',
    description: 'Status to look for (optional)',
    enum: TourStatus,
  })
  status?: TourStatus;
}
