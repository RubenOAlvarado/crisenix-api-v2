import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { TourService } from './tour.service';
import { TourByIncluded } from '@/shared/models/dtos/tour/tourbyincluded.dto';
import { ApiPaginatedResponse } from '@/shared/decorators/api-paginated.response.dto';
import { ResponseTourDTO } from '@/shared/models/dtos/tour/responsetour.dto';
import { Public } from '@/auth/public.decorator';
import { PaginatedTourDTO } from '@/shared/models/dtos/tour/paginatedTour.dto';
import { UrlValidator } from '@/shared/validators/urlValidator.dto';
import { ResponseIncludedDTO } from '@/shared/models/dtos/included/responseIncluded.dto';
import { CreateTourDTO } from '@/shared/models/dtos/tour/createtour.dto';
import { get } from 'http';
import { DestinationValidator } from '@/shared/validators/destination.validator';

@ApiTags('Tour')
@Controller('tour')
export class TourController {
  constructor(private tourService: TourService) {}

  @ApiCreatedResponse({
    description: 'Tour successfully created.',
    type: ResponseTourDTO,
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong creating tour.',
  })
  @ApiBody({ type: CreateTourDTO })
  @Post('create')
  async createTour(@Body() tour: CreateTourDTO) {
    return await this.tourService.createTour(tour);
  }

  @ApiOkResponse({
    description: 'Tour found.',
    type: ResponseTourDTO,
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong finding tour.',
  })
  @ApiNotFoundResponse({
    description: 'Tour not found.',
  })
  @Get('web/:id')
  async getTour(@Param() param: UrlValidator) {
    return await this.tourService.getWebTourById(param);
  }

  @ApiOkResponse({
    description: 'Tour found.',
    type: ResponseTourDTO,
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong finding tour.',
  })
  @ApiNotFoundResponse({
    description: 'Tour not found.',
  })
  @Get(':id')
  async getTourById(@Param() param: UrlValidator) {
    return await this.tourService.findOne(param);
  }

  @ApiOkResponse({
    description: 'Last tour registered found.',
    type: ResponseTourDTO,
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong finding last tour registered.',
  })
  @ApiNotFoundResponse({
    description: 'No tours registered for that destination.',
  })
  @ApiBadRequestResponse({
    description: 'Destination state must be active.',
  })
  @Get('last/:destination')
  async getLastTour(@Param() param: DestinationValidator) {
    return await this.tourService.getLastRegisteredTour(param);
  }

  @ApiPaginatedResponse(ResponseIncludedDTO)
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong looking tours by included service.',
  })
  @ApiNotFoundResponse({
    description: 'No tours registered for this included service.',
  })
  @Public()
  @Get('getByIncluded/:included')
  async getByIncluded(
    @Param() included: TourByIncluded,
    // @Query() query: QueryDTO,
  ) {
    return await this.tourService.getToursByIncluded(included);
  }

  @ApiPaginatedResponse(ResponseTourDTO)
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong finding tours.',
  })
  @ApiNotFoundResponse({
    description: 'Tours not found.',
  })
  @Get('')
  async getTours(@Query() query: PaginatedTourDTO) {
    return await this.tourService.findAll(query);
  }

  @ApiOkResponse({
    description: 'Itineraries found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong finding itineraries.',
  })
  @ApiNotFoundResponse({
    description: 'Itineraries not found.',
  })
  @ApiBadRequestResponse({
    description: 'Tour does not exist.',
  })
  @Public()
  @Get('itineraries/:id')
  async getTourItineraries(@Param() param: UrlValidator) {
    return await this.tourService.getTourItineraries(param);
  }
}
