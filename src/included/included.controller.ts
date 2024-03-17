import { PaginatedDTO } from '@/shared/dtos/paginated.dto';
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
import { IncludedService } from './included.service';
import { ResponseIncludedDTO } from '@/shared/models/dtos/included/responseIncluded.dto';
import { Public } from '@/auth/public.decorator';
import { UrlValidator } from '@/shared/validators/urlValidator.dto';
import { Entry } from '@/shared/enums/entry.enum';
import { HotelStatus } from '@/shared/enums/hotelstatus.enum';
import { ApiPaginatedResponse } from '@/shared/decorators/api-paginated.response.dto';
import { QueryDTO } from '@/shared/dtos/query.dto';
import { CreateItineraryDTO } from '@/shared/models/dtos/itinerary/createitinerary.dto';
import { UpdateItineraryDTO } from '@/shared/models/dtos/itinerary/updateitinerary.dto';

@Controller('included')
@ApiTags('Included')
@ApiExtraModels(PaginatedDTO)
export class IncludedController {
  constructor(private readonly includedService: IncludedService) {}

  @ApiCreatedResponse({
    description: 'The included service has been found.',
    type: ResponseIncludedDTO,
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong creating the included service.',
  })
  @ApiBody({ type: CreateItineraryDTO })
  @Post('create')
  async create(
    @Body() createItineraryDTO: CreateItineraryDTO,
  ): Promise<ResponseIncludedDTO> {
    return await this.includedService.create(createItineraryDTO);
  }

  @ApiOkResponse({
    description: 'The included service has been found.',
    type: ResponseIncludedDTO,
  })
  @ApiNotFoundResponse({
    description: 'Included service not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong finding the included service.',
  })
  @Public()
  @Get(':id')
  async findOne(
    @Param() urlValidator: UrlValidator,
  ): Promise<ResponseIncludedDTO> {
    return await this.includedService.findOne(urlValidator);
  }

  @ApiPaginatedResponse(ResponseIncludedDTO)
  @ApiNotFoundResponse({ description: 'No included services registered.' })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong finding the included services.',
  })
  @Public()
  @Get()
  async findAll(
    @Query() queryDTO: QueryDTO,
  ): Promise<PaginatedDTO<ResponseIncludedDTO>> {
    return await this.includedService.findAll(queryDTO);
  }

  @ApiOkResponse({
    description: 'The included service has been updated.',
    type: ResponseIncludedDTO,
  })
  @ApiNotFoundResponse({
    description: 'Included service not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong updating the included service.',
  })
  @Put(':id')
  async update(
    @Param() urlValidator: UrlValidator,
    @Body() updateItineraryDTO: UpdateItineraryDTO,
  ): Promise<ResponseIncludedDTO> {
    return await this.includedService.update(urlValidator, updateItineraryDTO);
  }

  @ApiOkResponse({
    description: 'The included service has been deleted.',
    type: ResponseIncludedDTO,
  })
  @ApiNotFoundResponse({
    description: 'Included service not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong deleting the included service.',
  })
  @Delete(':id')
  async delete(
    @Param() urlValidator: UrlValidator,
  ): Promise<ResponseIncludedDTO> {
    return await this.includedService.delete(urlValidator);
  }

  @ApiOkResponse({
    description: 'The included service has been reactivated.',
    type: ResponseIncludedDTO,
  })
  @ApiNotFoundResponse({
    description: 'Included service not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong reactivating the included service.',
  })
  @Patch('reactivate/:id')
  async reactivate(@Param() urlValidator: UrlValidator): Promise<void> {
    return await this.includedService.reactivate(urlValidator);
  }
}
