import { PaginatedDTO } from '@/shared/dtos/paginated.dto';
import { UrlValidator } from '@/shared/validators/urlValidator.dto';
import {
  Controller,
  Get,
  Param,
  Body,
  Post,
  Query,
  Put,
  Delete,
  Patch,
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
import { DestinationService } from './destination.service';
import { Public } from '@/auth/public.decorator';
import { ApiPaginatedResponse } from '@/shared/decorators/api-paginated.response.dto';
import { QueryDTO } from '@/shared/dtos/query.dto';
import { PhotoValidator } from '@/shared/validators/photo.validator';
import { CreateDestinationDTO } from '@/shared/models/dtos/request/destination/createdestination.dto';
import { UpdateDestinationDTO } from '@/shared/models/dtos/request/destination/updatedestination.dto';
import { ResponseDestinationDTO } from '@/shared/models/dtos/response/destination/responsedestination.dto';
import { ResponseOriginCityDTO } from '@/shared/models/dtos/response/origincity/responseorigincity.dto';
import { SearcherDestinationDto } from '@/shared/dtos/searcher/destination/searcherDestination.dto';

@Controller('destination')
@ApiTags('Destination')
@ApiExtraModels(PaginatedDTO)
export class DestinationController {
  constructor(private readonly destinationService: DestinationService) {}

  @ApiCreatedResponse({
    description: 'The destination has been created.',
    type: ResponseDestinationDTO,
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong creating the destination.',
  })
  @ApiBody({ type: CreateDestinationDTO })
  @Post('/create')
  async create(@Body() createDestinationDTO: CreateDestinationDTO) {
    return await this.destinationService.create(createDestinationDTO);
  }

  @ApiInternalServerErrorResponse({
    description: 'Something went wrong finding the destinations.',
  })
  @ApiNotFoundResponse({
    description: 'Destinations not found.',
  })
  @Public()
  @Get()
  async findAll(@Query() queryDTO: QueryDTO) {
    return await this.destinationService.findAll(queryDTO);
  }

  @ApiOkResponse({
    description: 'The destination has been found.',
    type: ResponseDestinationDTO,
  })
  @ApiNotFoundResponse({
    description: 'Destination not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong finding the destination.',
  })
  @Get(':id')
  @Public()
  async findOne(@Param() urlValidator: UrlValidator) {
    return await this.destinationService.findOne(urlValidator);
  }

  @ApiOkResponse({
    description: 'The destination have been found.',
    type: ResponseDestinationDTO,
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong finding the destination.',
  })
  @ApiNotFoundResponse({
    description: 'Destination not found.',
  })
  @Get('web/:id')
  async findOneWeb(@Param() urlValidator: UrlValidator) {
    return await this.destinationService.findOneWeb(urlValidator);
  }

  @ApiOkResponse({
    description: 'Destination successfully updated.',
    type: ResponseDestinationDTO,
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong updating the destination.',
  })
  @ApiNotFoundResponse({
    description: 'Destination not found.',
  })
  @ApiBody({ type: UpdateDestinationDTO })
  @Put('/:id')
  async update(
    @Param() urlValidator: UrlValidator,
    @Body() updateDestinationDTO: UpdateDestinationDTO,
  ) {
    const updatedDestination = await this.destinationService.update(
      urlValidator,
      updateDestinationDTO,
    );
    return updatedDestination;
  }

  @ApiOkResponse({
    description: 'Destination successfully deleted.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong deleting the destination.',
  })
  @ApiNotFoundResponse({
    description: 'Destination not found.',
  })
  @Delete('/:id')
  async delete(@Param() urlValidator: UrlValidator): Promise<string> {
    await this.destinationService.delete(urlValidator);
    return 'Destination successfully deleted.';
  }

  @ApiOkResponse({
    description: 'Destination successfully reactivated.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong reactivating the destination.',
  })
  @ApiNotFoundResponse({
    description: 'Destination not found.',
  })
  @Patch('reactivate/:id')
  async reactivate(@Param() urlValidator: UrlValidator): Promise<string> {
    await this.destinationService.reactivate(urlValidator);
    return 'Destination successfully reactivated.';
  }

  @ApiPaginatedResponse(ResponseDestinationDTO)
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong searching the destinations.',
  })
  @ApiNotFoundResponse({
    description: 'Destinations not found.',
  })
  @Public()
  @Get('search/:word/:field/:subCatalog/:sort')
  async search(
    @Param() params: SearcherDestinationDto,
    @Query() queryDTO: QueryDTO,
  ) {
    return await this.destinationService.search(params, queryDTO);
  }

  @ApiOkResponse({
    description: 'Destination photos successfully deleted.',
    type: String,
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong deleting the destination photos.',
  })
  @ApiNotFoundResponse({
    description: 'Destination not found.',
  })
  @ApiBadRequestResponse({
    description: 'Destination must be in Active status.',
  })
  @Delete('deletephoto')
  @ApiBody({
    description: 'Destination and photo to delete',
    type: PhotoValidator,
  })
  async deletePhoto(@Body() photoValidator: PhotoValidator): Promise<string> {
    await this.destinationService.deletePhotos(photoValidator);
    return 'Destination photos successfully deleted.';
  }

  @ApiOkResponse({
    description: 'Destination cities found.',
    type: ResponseOriginCityDTO,
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong finding the destination cities.',
  })
  @ApiNotFoundResponse({
    description: 'Destination not found.',
  })
  @Public()
  @Get('cities/:id')
  async findCities(@Param() urlValidator: UrlValidator) {
    return await this.destinationService.findCities(urlValidator);
  }
}
