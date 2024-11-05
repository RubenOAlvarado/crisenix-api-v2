import {
  ApiBadRequestResponse,
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
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { OriginCities } from 'src/shared/models/schemas/origincity.schema';
import { QueryDTO } from '@/shared/models/dtos/searcher/query.dto';
import { ApiPaginatedResponse } from '@/shared/decorators/api-paginated.response.dto';
import { PaginatedResponseDTO } from '@/shared/models/dtos/response/paginatedResponse.dto';
import { Public } from '@/auth/public.decorator';
import { ResponseOriginCityDTO } from '@/shared/models/dtos/response/origincity/responseorigincity.dto';
import { CreateOriginCityDTO } from '@/shared/models/dtos/request/originCity/createorigincity.dto';
import { UpdateOriginCityDTO } from '@/shared/models/dtos/request/originCity/updateorigincity.dto';
import { AddAboardPointsDTO } from '@/shared/models/dtos/request/originCity/add-aboard-points.dto';
import { OriginCitySearcherDto } from '@/shared/models/dtos/searcher/originCity/searcherOriginCity.dto';
import { IdValidator } from '@/shared/models/dtos/validators/id.validator';
import { StatusDTO } from '@/shared/models/dtos/searcher/statusparam.dto';

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
    @Param() param: IdValidator,
    @Body() updateOriginCityDTO: UpdateOriginCityDTO,
  ) {
    return await this.originCityService.update(param, updateOriginCityDTO);
  }

  @ApiOkResponse({
    description: 'The origin city status has been successfully changed.',
  })
  @ApiNotFoundResponse({
    description: 'Origin city not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong changing the origin city status.',
  })
  @ApiBadRequestResponse({
    description: 'The status is invalid.',
  })
  @Patch(':id')
  async changeStatus(
    @Param() param: IdValidator,
    @Query() query: StatusDTO,
  ): Promise<string> {
    await this.originCityService.changeStatus(param, query);
    return 'The origin city status has been successfully changed.';
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
  @Patch(':id/addPoints')
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
