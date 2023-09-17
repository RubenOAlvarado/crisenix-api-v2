import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { TourService } from './tour.service';
import { TourByIncluded } from '@/shared/models/dtos/tour/tourbyincluded.dto';
import { QueryDTO } from '@/shared/dtos/query.dto';

@ApiTags('Tour')
@Controller('tour')
export class TourController {
  constructor(private tourService: TourService) {}

  @ApiExcludeEndpoint()
  @Get('getByIncluded/:included')
  async getByIncluded(
    @Param() included: TourByIncluded,
    @Query() query: QueryDTO,
  ) {
    return await this.tourService.getToursByIncluded(query, included);
  }
}
