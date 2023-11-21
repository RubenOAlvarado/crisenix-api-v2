import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ItineraryService } from './itinerary.service';
import { ApiPaginatedResponse } from '@/shared/decorators/api-paginated.response.dto';
import { ResponseItineraryDTO } from '@/shared/models/dtos/itinerary/reponseitinerary.dto';
import { PaginationDTO } from '@/shared/dtos/pagination.dto';
import { PaginatedDTO } from '@/shared/dtos/paginated.dto';
import { Public } from '@/auth/public.decorator';

@Controller('itinerary')
@ApiTags('Itinerary')
@ApiExtraModels(PaginatedDTO)
export class ItineraryController {
  constructor(private itineraryService: ItineraryService) {}

  @ApiPaginatedResponse(ResponseItineraryDTO)
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong finding itineraries.',
  })
  @ApiNotFoundResponse({
    description: 'Itineraries not found.',
  })
  @Public()
  @Get('')
  async getTours(@Query() query: PaginationDTO) {
    return await this.itineraryService.findAll(query);
  }
}
