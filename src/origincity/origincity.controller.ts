import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { OriginCityService } from './origincity.service';
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
import { OriginCities } from 'src/shared/models/schemas/origincity.schema';
import { IdValidator } from '@/shared/models/dtos/validators/id.validator';
import { QueryDTO } from '@/shared/models/dtos/searcher/query.dto';
import { ApiPaginatedResponse } from '@/shared/decorators/api-paginated.response.dto';
import { PaginatedResponseDTO } from '@/shared/models/dtos/response/paginatedResponse.dto';
import { Public } from '@/auth/public.decorator';
import { ResponseOriginCityDTO } from '@/shared/models/dtos/response/origincity/responseorigincity.dto';
import { CreateOriginCityDTO } from '@/shared/models/dtos/request/originCity/createorigincity.dto';
import { UpdateOriginCityDTO } from '@/shared/models/dtos/request/originCity/updateorigincity.dto';
import { AddAboardPointsDTO } from '@/shared/models/dtos/request/originCity/add-aboard-points.dto';
import { OriginCitySearcherDto } from '@/shared/models/dtos/searcher/originCity/searcherOriginCity.dto';

@ApiBearerAuth()
@Controller('origincity')
@ApiTags('Origin City')
@ApiExtraModels(PaginatedResponseDTO)
export class OriginCityController {
  constructor(private readonly originCityService: OriginCityService) {}

  @ApiCreatedResponse({
    description: 'The origin city has been successfully created.',
    type: ResponseOriginCityDTO,
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong creating the origin city.',
  })
  @Post()
  @ApiBody({
    description: 'Origin city object',
    type: CreateOriginCityDTO,
  })
  async create(@Body() createOriginCityDTO: CreateOriginCityDTO) {
    return await this.originCityService.create(createOriginCityDTO);
  }

  @ApiOkResponse({
    description: 'The origin city has been found.',
    type: ResponseOriginCityDTO,
  })
  @ApiNotFoundResponse({
    description: 'Origin city not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong finding the origin city.',
  })
  @Get(':id')
  @Public()
  async findOne(@Param() IdValidator: IdValidator) {
    return await this.originCityService.findOne(IdValidator);
  }

  @ApiPaginatedResponse(ResponseOriginCityDTO)
  @ApiNotFoundResponse({ description: 'No origin cities registered.' })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong finding the origin cities.',
  })
  @Public()
  @Get()
  async findAll(@Query() queryDTO: QueryDTO) {
    return await this.originCityService.findAll(queryDTO);
  }

  @ApiOkResponse({
    description: 'The origin city has been successfully updated.',
    type: ResponseOriginCityDTO,
  })
  @ApiNotFoundResponse({
    description: 'Origin city not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong updating the origin city.',
  })
  @Put(':id')
  @ApiBody({
    description: 'Origin city object',
    type: UpdateOriginCityDTO,
  })
  async update(
    @Param() IdValidator: IdValidator,
    @Body() updateOriginCityDTO: UpdateOriginCityDTO,
  ) {
    return await this.originCityService.update(
      IdValidator,
      updateOriginCityDTO,
    );
  }

  @ApiOkResponse({
    description: 'The origin city has been successfully deleted.',
  })
  @ApiNotFoundResponse({
    description: 'Origin city not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong deleting the origin city.',
  })
  @Delete(':id')
  async delete(@Param() IdValidator: IdValidator): Promise<string> {
    await this.originCityService.delete(IdValidator);
    return 'The origin city has been successfully deleted.';
  }

  @ApiOkResponse({
    description: 'The origin city has been successfully activated.',
  })
  @ApiNotFoundResponse({
    description: 'Origin city not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong activating the origin city.',
  })
  @Patch('reactivate/:id')
  async reactivate(@Param() IdValidator: IdValidator): Promise<string> {
    await this.originCityService.reactivate(IdValidator);
    return 'The origin city has been successfully activated.';
  }

  @ApiOkResponse({
    description: 'The origin city/es has been successfully found.',
    type: ResponseOriginCityDTO,
    isArray: true,
  })
  @ApiNotFoundResponse({
    description: 'Any origin city match your search.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong searching for the origin city.',
  })
  @Public()
  @Get('search/:word')
  async search(
    @Param() searcherDTO: OriginCitySearcherDto,
  ): Promise<Array<OriginCities>> {
    return await this.originCityService.searcher(searcherDTO);
  }

  @ApiOkResponse({
    description:
      'The aboard point/s has been successfully added to the origin city.',
  })
  @ApiNotFoundResponse({
    description: 'Origin city not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong adding the aboard point/s.',
  })
  @Patch('addpoints/:id')
  @ApiBody({
    description: 'Array of aboard points ids',
    type: AddAboardPointsDTO,
    isArray: true,
  })
  async addPoints(
    @Param() IdValidator: IdValidator,
    @Body() aboardPointsDTO: AddAboardPointsDTO,
  ): Promise<string> {
    await this.originCityService.addAboardPoints(IdValidator, aboardPointsDTO);
    return 'The aboard point/s has been successfully added to the origin city.';
  }
}
