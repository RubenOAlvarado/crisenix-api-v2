import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
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
import { Public } from '@/auth/public.decorator';
import { ResponseOriginCityDTO } from '@/shared/models/dtos/response/origincity/responseorigincity.dto';
import { CreateOriginCityDTO } from '@/shared/models/dtos/request/originCity/createorigincity.dto';
import { UpdateOriginCityDTO } from '@/shared/models/dtos/request/originCity/updateorigincity.dto';
import { IdValidator } from '@/shared/models/dtos/validators/id.validator';
import { StatusDTO } from '@/shared/models/dtos/searcher/statusparam.dto';
import { QueryDTO } from '@/shared/models/dtos/searcher/query.dto';

@Controller('origin-cities')
@ApiTags('Origin Cities')
export class OriginCityController {
  constructor(private readonly originCityService: OriginCityService) {}

  @ApiOperation({ summary: 'Create a new origin city' })
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

  @ApiOperation({ summary: 'Get all origin cities' })
  @ApiOkResponse({
    description: 'All origin cities have been found.',
    type: ResponseOriginCityDTO,
  })
  @ApiNotFoundResponse({ description: 'No origin cities registered.' })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong finding the origin cities.',
  })
  @Public()
  @Get()
  async findAll(@Query() queryDTO: QueryDTO) {
    return await this.originCityService.findAll(queryDTO);
  }

  @ApiOperation({ summary: 'Get an origin city by id' })
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

  @ApiOperation({ summary: 'Update an origin city' })
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

  @ApiOperation({ summary: 'Change the status of an origin city' })
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
  @Patch(':id/change-status')
  async changeStatus(
    @Param() param: IdValidator,
    @Query() query: StatusDTO,
  ): Promise<string> {
    await this.originCityService.changeStatus(param, query);
    return 'The origin city status has been successfully changed.';
  }
}
