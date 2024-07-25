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
import { UrlValidator } from '@/shared/validators/urlValidator.dto';
import { DestinationValidator } from '@/shared/validators/destination.validator';
import { SearcherTourDTO } from '@/shared/enums/searcher/tour/searcher.dto';
import { PaginationDTO } from '@/shared/dtos/pagination.dto';
import { ChangeTourStatusDTO } from '@/shared/enums/searcher/tour/changeStatus.dto';
import { ResponseTourDTO } from '@/shared/models/dtos/response/tour/responsetour.dto';
import { CreateTourDTO } from '@/shared/models/dtos/request/tour/createtour.dto';
import { PaginatedTourDTO } from '@/shared/models/dtos/response/tour/paginatedTour.dto';
import { GetTourCatalogDTO } from '@/shared/models/dtos/request/tour/getTourCatalog.dto';
import { UpdateTourDTO } from '@/shared/models/dtos/request/tour/updatetour.dto';
import { UpdateTourCatalogDTO } from '@/shared/models/dtos/request/tour/updateTourCatalog.dto';
import { CatalogValidationInterceptor } from '@/shared/interceptors/catalogValidationInterceptor';
import { plainToInstance } from 'class-transformer';
import { PaginatedDTO } from '@/shared/dtos/paginated.dto';

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
  @Public()
  @Get(':id')
  async getTourById(@Param() param: UrlValidator) {
    const tour = await this.tourService.findOne(param);
    return plainToInstance(ResponseTourDTO, tour);
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
    const tour = await this.tourService.getLastRegisteredTour(param);
    return plainToInstance(ResponseTourDTO, tour);
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
    const tours = await this.tourService.findAll(query);
    return plainToInstance(PaginatedDTO<ResponseTourDTO>, tours);
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
  @Get('get-catalog/:catalogName/:id')
  async getTourCatalog(@Param() param: GetTourCatalogDTO) {
    return await this.tourService.getTourCatalog(param);
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
    const updatedTour = await this.tourService.updateTour(param, tour);
    return plainToInstance(ResponseTourDTO, updatedTour);
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
    await this.tourService.deleteTour(param);
    return 'Tour deleted successfully.';
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
    const toursResponse = await this.tourService.searchTours(body, query);
    return plainToInstance(PaginatedDTO<ResponseTourDTO>, toursResponse);
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
  @Patch('change-status/:newStatus/:id')
  async changeTourStatus(@Param() param: ChangeTourStatusDTO) {
    const updatedTour = await this.tourService.changeTourStatus(param);
    return plainToInstance(ResponseTourDTO, updatedTour);
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
  @Patch('update-catalog')
  @ApiBody({
    description: 'The catalog name and the new values to be updated.',
    type: UpdateTourCatalogDTO,
  })
  @UseInterceptors(CatalogValidationInterceptor)
  @Public()
  async updateTourCatalog(@Body() body: UpdateTourCatalogDTO) {
    return await this.tourService.updateTourCatalog(body);
  }
}
