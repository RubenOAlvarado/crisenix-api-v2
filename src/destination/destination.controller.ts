import { PaginatedResponseDTO } from '@/shared/models/dtos/response/paginatedResponse.dto';
import { IdValidator } from '@/shared/models/dtos/validators/id.validator';
import {
  Controller,
  Get,
  Param,
  Body,
  Post,
  Query,
  Put,
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
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { DestinationService } from './destination.service';
import { Public } from '@/auth/public.decorator';
import { ApiPaginatedResponse } from '@/shared/decorators/api-paginated.response.dto';
import { QueryDTO } from '@/shared/models/dtos/searcher/query.dto';
import { PhotoValidator } from '@/shared/models/dtos/validators/photo.validator';
import { CreateDestinationDTO } from '@/shared/models/dtos/request/destination/createdestination.dto';
import { UpdateDestinationDTO } from '@/shared/models/dtos/request/destination/updatedestination.dto';
import { ResponseDestinationDTO } from '@/shared/models/dtos/response/destination/responsedestination.dto';
import { StatusDTO } from '@/shared/models/dtos/searcher/statusparam.dto';
import { SearcherDestinationDto } from '@/shared/models/dtos/searcher/destination/searcherDestination.dto';
import { FetchOptionsDto } from '@/shared/models/dtos/searcher/fetchOptions.dto';

@Controller('destinations')
@ApiTags('Destinations')
@ApiExtraModels(PaginatedResponseDTO)
export class DestinationController {
  constructor(private readonly destinationService: DestinationService) {}

  @ApiOperation({ summary: 'Create a new destination.' })
  @ApiCreatedResponse({
    description: 'The destination has been created.',
    type: ResponseDestinationDTO,
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong creating the destination.',
  })
  @ApiBody({ type: CreateDestinationDTO })
  @Post()
  async create(@Body() createDestinationDTO: CreateDestinationDTO) {
    return await this.destinationService.create(createDestinationDTO);
  }

  @ApiOperation({ summary: 'Find all destinations.' })
  @ApiPaginatedResponse(ResponseDestinationDTO)
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

  @ApiOperation({ summary: 'Search destinations.' })
  @ApiPaginatedResponse(ResponseDestinationDTO)
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong searching the destinations.',
  })
  @ApiNotFoundResponse({
    description: 'Destinations not found.',
  })
  @Public()
  @Get('search')
  async search(@Query() queryDTO: SearcherDestinationDto) {
    return await this.destinationService.search(queryDTO);
  }

  @ApiOperation({ summary: 'Delete destination photos.' })
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
  @Patch(':id/photos')
  @ApiBody({
    description: 'Photo or photos to delete',
    type: PhotoValidator,
  })
  async deletePhoto(
    @Param() param: IdValidator,
    @Body() photoValidator: PhotoValidator,
  ): Promise<string> {
    await this.destinationService.deletePhotos(param, photoValidator);
    return 'Destination photos successfully deleted.';
  }

  @ApiOperation({ summary: 'Find a destination by id.' })
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
  async findOne(
    @Param() IdValidator: IdValidator,
    @Query() query: FetchOptionsDto,
  ) {
    return await this.destinationService.findOne(IdValidator, query);
  }

  @ApiOperation({ summary: 'Update a destination by id.' })
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
    @Param() IdValidator: IdValidator,
    @Body() updateDestinationDTO: UpdateDestinationDTO,
  ) {
    const updatedDestination = await this.destinationService.update(
      IdValidator,
      updateDestinationDTO,
    );
    return updatedDestination;
  }

  @ApiOperation({ summary: 'Change a destination status by id.' })
  @ApiOkResponse({
    description: 'Destination status successfully changed.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong changing the destination status.',
  })
  @ApiNotFoundResponse({
    description: 'Destination not found.',
  })
  @ApiBadRequestResponse({
    description: 'Wrong new status.',
  })
  @Patch(':id/change-status')
  async delete(
    @Param() IdValidator: IdValidator,
    @Query() status: StatusDTO,
  ): Promise<string> {
    await this.destinationService.changeStatus(IdValidator, status);
    return 'Destination successfully deleted.';
  }
}
