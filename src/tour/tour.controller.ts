import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiExcludeEndpoint,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiTags,
} from '@nestjs/swagger';
import { TourService } from './tour.service';
import { TourByIncluded } from '@/shared/models/dtos/tour/tourbyincluded.dto';
import { QueryDTO } from '@/shared/dtos/query.dto';
import { ApiPaginatedResponse } from '@/shared/decorators/api-paginated.response.dto';
import { ResponseTourDTO } from '@/shared/models/dtos/tour/responsetour.dto';
import { Public } from '@/auth/public.decorator';
import { PaginatedTourDTO } from '@/shared/models/dtos/tour/paginatedTour.dto';

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

  @ApiPaginatedResponse(ResponseTourDTO)
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong finding tours.',
  })
  @ApiNotFoundResponse({
    description: 'Tours not found.',
  })
  @Public()
  @Get('')
  async getTours(@Query() { page, limit, status }: PaginatedTourDTO) {
    return await this.tourService.findAll({ page, limit, status });
  }
}
