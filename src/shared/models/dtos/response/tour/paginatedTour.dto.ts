import { PaginationDTO } from '@/shared/dtos/pagination.dto';
import { TourStatus } from '@/shared/enums/tour/status.enum';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class PaginatedTourDTO extends PaginationDTO {
  @ApiPropertyOptional({
    default: 'Activo',
    description: 'Status to look for (optional)',
    enum: TourStatus,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  status?: TourStatus;
}
