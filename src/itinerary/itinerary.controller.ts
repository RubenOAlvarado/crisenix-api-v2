import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ItineraryService } from './itinerary.service';
import { ApiPaginatedResponse } from '@/shared/decorators/api-paginated.response.dto';
import { ResponseItineraryDTO } from '@/shared/models/dtos/itinerary/reponseitinerary.dto';
import { PaginatedDTO } from '@/shared/dtos/paginated.dto';
import { Public } from '@/auth/public.decorator';
import { CreateItineraryDTO } from '@/shared/models/dtos/itinerary/createitinerary.dto';
import { QueryDTO } from '@/shared/dtos/query.dto';
import { UrlValidator } from '@/shared/validators/urlValidator.dto';
import { UpdateItineraryDTO } from '@/shared/models/dtos/itinerary/updateitinerary.dto';

@Controller('itinerary')
@ApiTags('Itinerary')
@ApiExtraModels(PaginatedDTO)
export class ItineraryController {
  constructor(private itineraryService: ItineraryService) {}

  @ApiCreatedResponse({
    description: 'Itinerary created.',
    type: ResponseItineraryDTO,
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong creating itinerary.',
  })
  @ApiBadRequestResponse({
    description: 'Invalid data.',
  })
  @Post('create')
  @ApiBody({ type: CreateItineraryDTO })
  async createItinerary(@Body() body: CreateItineraryDTO) {
    return await this.itineraryService.create(body);
  }

  @ApiPaginatedResponse(ResponseItineraryDTO)
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong finding itineraries.',
  })
  @ApiNotFoundResponse({
    description: 'Itineraries not found.',
  })
  @Public()
  @Get('')
  async getItineraries(@Query() query: QueryDTO) {
    return await this.itineraryService.findAll(query);
  }

  @ApiOkResponse({
    description: 'Itinerary found.',
    type: ResponseItineraryDTO,
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong finding itinerary.',
  })
  @ApiNotFoundResponse({
    description: 'Itinerary not found.',
  })
  @Get(':id')
  async getItineraryById(@Query() param: UrlValidator) {
    return await this.itineraryService.findById(param);
  }

  @ApiOkResponse({
    description: 'Itinerary updated.',
    type: ResponseItineraryDTO,
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong updating itinerary.',
  })
  @ApiNotFoundResponse({
    description: 'Itinerary not found.',
  })
  @Put(':id')
  @ApiBody({ type: UpdateItineraryDTO })
  async updateItinerary(
    @Body() body: UpdateItineraryDTO,
    @Query() param: UrlValidator,
  ) {
    return await this.itineraryService.update(body, param);
  }

  @ApiOkResponse({
    description: 'Itinerary deleted.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong deleting itinerary.',
  })
  @ApiNotFoundResponse({
    description: 'Itinerary not found.',
  })
  @Delete(':id')
  async deleteItinerary(@Query() param: UrlValidator) {
    return await this.itineraryService.delete(param);
  }

  @ApiOkResponse({
    description: 'Itinerary reactivated successfully.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong reactivating itinerary.',
  })
  @ApiNotFoundResponse({
    description: 'Itinerary not found.',
  })
  @Patch(':id/reactivate')
  async reactivateItinerary(@Query() param: UrlValidator) {
    return await this.itineraryService.reactivate(param);
  }
}
