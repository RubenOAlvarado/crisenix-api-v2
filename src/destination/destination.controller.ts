import { PaginatedDTO } from '@/shared/dtos/paginated.dto';
import { ResponseDestinationDTO } from '@/shared/models/dtos/destination/responsedestination.dto';
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
import { SearcherDTO } from '@/shared/dtos/searcher.dto';
import { CreateDestinationDTO } from '@/shared/models/dtos/destination/createdestination.dto';
import { ApiPaginatedResponse } from '@/shared/decorators/api-paginated.response.dto';
import { QueryDTO } from '@/shared/dtos/query.dto';
import { PaginateResult } from '@/shared/interfaces/paginate.interface';
import { UpdateDestinationDTO } from '@/shared/models/dtos/destination/updatedestination.dto';

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
  async create(
    @Body() createDestinationDTO: CreateDestinationDTO,
  ): Promise<ResponseDestinationDTO> {
    return await this.destinationService.create(createDestinationDTO);
  }

  @ApiPaginatedResponse(ResponseDestinationDTO)
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong finding the destinations.',
  })
  @ApiNotFoundResponse({
    description: 'Destinations not found.',
  })
  @Get()
  async findAll(
    @Query() queryDTO: QueryDTO,
  ): Promise<PaginateResult<ResponseDestinationDTO>> {
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
  async findOne(
    @Param() urlValidator: UrlValidator,
  ): Promise<ResponseDestinationDTO> {
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
  async findOneWeb(
    @Param() urlValidator: UrlValidator,
  ): Promise<ResponseDestinationDTO> {
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
  ): Promise<ResponseDestinationDTO> {
    return await this.destinationService.update(
      urlValidator,
      updateDestinationDTO,
    );
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

  @ApiOkResponse({
    description: 'Destination successfully searched.',
    type: ResponseDestinationDTO,
    isArray: true,
  })
  @Public()
  @Post('/search')
  @ApiBody({
    description: 'Field and word to look for in destinations catalog',
    type: SearcherDTO,
  })
  async search(@Body() searcherDTO: SearcherDTO) {
    return await this.destinationService.search(searcherDTO);
  }
}
