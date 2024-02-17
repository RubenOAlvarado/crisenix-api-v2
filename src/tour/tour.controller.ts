import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
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
import { ApiPaginatedResponse } from '@/shared/decorators/api-paginated.response.dto';
import { ResponseTourDTO } from '@/shared/models/dtos/tour/responsetour.dto';
import { Public } from '@/auth/public.decorator';
import { PaginatedTourDTO } from '@/shared/models/dtos/tour/paginatedTour.dto';
import { UrlValidator } from '@/shared/validators/urlValidator.dto';
import { CreateTourDTO } from '@/shared/models/dtos/tour/createtour.dto';
import { DestinationValidator } from '@/shared/validators/destination.validator';
import { UpdateTourDTO } from '@/shared/models/dtos/tour/updatetour.dto';
import { SearcherTourDTO } from '@/shared/enums/searcher/tour/searcher.dto';
import { PaginationDTO } from '@/shared/dtos/pagination.dto';

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
  @Public()
  @Get('last/:destination')
  async getLastTour(@Param() param: DestinationValidator) {
    return await this.tourService.getLastRegisteredTour(param);
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

  @ApiOkResponse({
    description: 'Tour updated successfully.',
    type: ResponseTourDTO,
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong updating tour.',
  })
  @ApiNotFoundResponse({
    description: 'Tour not found.',
  })
  @ApiBadRequestResponse({
    description: 'Tour does not exist.',
  })
  @ApiBody({ type: UpdateTourDTO })
  @Put(':id')
  async updateTour(@Param() param: UrlValidator, @Body() tour: UpdateTourDTO) {
    return await this.tourService.updateTour(param, tour, 'dev');
  }

  @ApiOkResponse({
    description: 'Tour deleted successfully.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong deleting tour.',
  })
  @ApiNotFoundResponse({
    description: 'Tour not found.',
  })
  @ApiBadRequestResponse({
    description: 'Tour does not exist.',
  })
  @Delete(':id')
  async deleteTour(@Param() param: UrlValidator) {
    return await this.tourService.deleteTour(param, 'dev');
  }

  @ApiPaginatedResponse(ResponseTourDTO)
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong searching tours.',
  })
  @ApiNotFoundResponse({
    description: 'Tours not found.',
  })
  @Public()
  @Post('search')
  @ApiBody({ type: SearcherTourDTO })
  async searchTours(
    @Body() body: SearcherTourDTO,
    @Query() query: PaginationDTO,
  ) {
    return await this.tourService.searchTours(body, query);
  }
}
