import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { TourService } from './tour.service';
import { ApiPaginatedResponse } from '@/shared/decorators/api-paginated.response.dto';
import { Public } from '@/auth/public.decorator';
import { IdValidator } from '@/shared/models/dtos/validators/id.validator';
import { DestinationValidator } from '@/shared/models/dtos/validators/destination.validator';
import { ResponseTourDTO } from '@/shared/models/dtos/response/tour/responsetour.dto';
import { CreateTourDTO } from '@/shared/models/dtos/request/tour/createtour.dto';
import { PaginatedTourDTO } from '@/shared/models/dtos/response/tour/paginatedTour.dto';
import { GetTourCatalogDTO } from '@/shared/models/dtos/request/tour/getTourCatalog.dto';
import { UpdateTourDTO } from '@/shared/models/dtos/request/tour/updatetour.dto';
import { UpdateTourCatalogDTO } from '@/shared/models/dtos/request/tour/updateTourCatalog.dto';
import { CatalogValidationInterceptor } from '@/shared/interceptors/catalogValidationInterceptor';
import { SearcherTourDTO } from '@/shared/models/dtos/searcher/tour/searcherTour.dto';
import { ChangeTourStatusDTO } from '@/shared/models/dtos/searcher/tour/changeStatus.dto';

@ApiBearerAuth()
@ApiTags('Tours')
@Controller('tours')
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
  @Post()
  async createTour(@Body() tour: CreateTourDTO) {
    return await this.tourService.createTour(tour);
  }

  @ApiPaginatedResponse(ResponseTourDTO)
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong finding tours.',
  })
  @ApiNotFoundResponse({
    description: 'Tours not found.',
  })
  @Public()
  @Get()
  async getTours(@Query() query: PaginatedTourDTO) {
    return await this.tourService.findAll(query);
  }

  @ApiPaginatedResponse(ResponseTourDTO)
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong searching tours.',
  })
  @ApiNotFoundResponse({
    description: 'Tours not found.',
  })
  @Public()
  @Get('search')
  async searchTours(@Query() query: SearcherTourDTO) {
    return await this.tourService.searchTours(query);
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
  @Public()
  @Get(':id')
  async getTourById(@Param() param: IdValidator) {
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

  @ApiOkResponse({
    description: 'Catalog found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong finding catalog.',
  })
  @ApiNotFoundResponse({
    description: 'Tour not found.',
  })
  @ApiBadRequestResponse({
    description: 'Tour does not exist.',
  })
  @Public()
  @Get(':id/get-catalog')
  async getTourCatalog(
    @Param() param: IdValidator,
    @Query() query: GetTourCatalogDTO,
  ) {
    return await this.tourService.getTourCatalog(param, query);
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
  async updateTour(@Param() param: IdValidator, @Body() tour: UpdateTourDTO) {
    return await this.tourService.updateTour(param, tour);
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
  async deleteTour(@Param() param: IdValidator) {
    await this.tourService.deleteTour(param);
    return 'Tour deleted successfully.';
  }

  @ApiOkResponse({
    description: 'Tour status changed.',
    type: ResponseTourDTO,
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong changing tour status.',
  })
  @ApiNotFoundResponse({
    description: 'Tour not found.',
  })
  @ApiBadRequestResponse({
    description: `Tour status can't be changed because it's invalid or it's already in the required status.`,
  })
  @Public()
  @Patch(':id/change-status')
  async changeTourStatus(
    @Param() param: IdValidator,
    @Body() body: ChangeTourStatusDTO,
  ) {
    return await this.tourService.changeTourStatus(param, body);
  }

  @ApiOkResponse({
    description: 'Tour updated successfully.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong updating tour.',
  })
  @ApiNotFoundResponse({
    description: 'Tour not found.',
  })
  @ApiBadRequestResponse({
    description: 'You sent an invalid catalog name or incorrect values.',
  })
  @Patch(':id/update-catalog')
  @ApiBody({
    description: 'The catalog name and the new values to be updated.',
    type: UpdateTourCatalogDTO,
  })
  @UseInterceptors(CatalogValidationInterceptor)
  @Public()
  async updateTourCatalog(
    @Param() param: IdValidator,
    @Body() body: UpdateTourCatalogDTO,
  ) {
    return await this.tourService.updateTourCatalog(param, body);
  }
}
