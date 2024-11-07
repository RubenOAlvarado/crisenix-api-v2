import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateItineraryActivityDto } from '@/shared/models/dtos/request/itineraryActivity/createitineraryactivity.dto';
import { QueryDTO } from '@/shared/models/dtos/searcher/query.dto';
import { IdValidator } from '@/shared/models/dtos/validators/id.validator';
import { ItineraryActivityStatusDto } from '@/shared/models/dtos/request/itineraryActivity/itinerarystatus.dto';
import { ItineraryActivitiesService } from './itineraryActivities.service';
import { UpdateItineraryActivityDto } from '@/shared/models/dtos/request/itineraryActivity/updateitinerary.dto';

@ApiTags('Itinerary Activities')
@Controller('itinerary-activities')
export class ItineraryActivitiesController {
  constructor(
    private readonly itineraryActivitiesService: ItineraryActivitiesService,
  ) {}

  @ApiOperation({ summary: 'Create a new activity.' })
  @ApiCreatedResponse({
    description: 'The activity has been successfully created.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong creating the activity.',
  })
  @ApiBody({ type: CreateItineraryActivityDto })
  @Post()
  async create(@Body() createItineraryActivityDto: CreateItineraryActivityDto) {
    return await this.itineraryActivitiesService.create(
      createItineraryActivityDto,
    );
  }

  @ApiOperation({ summary: 'Find all activities.' })
  @ApiOkResponse({
    description: 'All activities found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong finding the activities.',
  })
  @ApiNotFoundResponse({
    description: 'No activities registered.',
  })
  @Get()
  async findAll(@Query() query: QueryDTO) {
    return await this.itineraryActivitiesService.findAll(query);
  }

  @ApiOperation({ summary: 'Find a activity by id.' })
  @ApiOkResponse({
    description: 'The activity has been found.',
  })
  @ApiNotFoundResponse({
    description: 'Activity not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong finding the activity.',
  })
  @Get(':id')
  async findOne(@Param() param: IdValidator) {
    return await this.itineraryActivitiesService.findOne(param);
  }

  @ApiOperation({ summary: 'Update a activity by id.' })
  @ApiOkResponse({
    description: 'The activity has been updated.',
  })
  @ApiNotFoundResponse({
    description: 'Activity not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong updating the activity.',
  })
  @ApiBody({ type: UpdateItineraryActivityDto })
  @Patch(':id')
  async update(
    @Param() param: IdValidator,
    @Body() updateItineraryDto: UpdateItineraryActivityDto,
  ) {
    return await this.itineraryActivitiesService.update(
      param,
      updateItineraryDto,
    );
  }

  @ApiOperation({ summary: 'Change activity status by id.' })
  @ApiOkResponse({
    description: 'The activity status has been successfully updated.',
  })
  @ApiNotFoundResponse({
    description: 'Activity not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong updating the activity status.',
  })
  @Patch(':id/change-status')
  async changeStatus(
    @Param() param: IdValidator,
    @Body() body: ItineraryActivityStatusDto,
  ) {
    return await this.itineraryActivitiesService.changeStatus(param, body);
  }
}
