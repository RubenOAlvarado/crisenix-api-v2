import { PaginatedResponseDTO } from '@/shared/models/dtos/response/paginatedResponse.dto';
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
import { Public } from '@/auth/public.decorator';
import { IdValidator } from '@/shared/models/dtos/validators/id.validator';
import { ApiPaginatedResponse } from '@/shared/decorators/api-paginated.response.dto';
import { QueryDTO } from '@/shared/models/dtos/searcher/query.dto';
import { ResponseIncludedDTO } from '@/shared/models/dtos/response/included/responseIncluded.dto';
import { CreateIncludedServiceDTO } from '@/shared/models/dtos/request/included/createincluded.dto';
import { UpdateIncludedServiceDTO } from '@/shared/models/dtos/request/included/updateincluded.dto';
import { IncludedServicesService } from './includedServices.service';
import { StatusDTO } from '@/shared/models/dtos/searcher/statusparam.dto';

@Controller('included-services')
@ApiTags('Included Services')
@ApiExtraModels(PaginatedResponseDTO)
export class IncludedServicesController {
  constructor(
    private readonly includedServicesService: IncludedServicesService,
  ) {}

  @ApiOperation({ summary: 'Create a new included service.' })
  @ApiCreatedResponse({
    description: 'The included service has been found.',
    type: ResponseIncludedDTO,
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong creating the included service.',
  })
  @ApiBody({ type: CreateIncludedServiceDTO })
  @Post()
  async create(@Body() createIncludedDTO: CreateIncludedServiceDTO) {
    return await this.includedServicesService.create(createIncludedDTO);
  }

  @ApiOperation({ summary: 'Find all included services.' })
  @ApiPaginatedResponse(ResponseIncludedDTO)
  @ApiNotFoundResponse({ description: 'No included services registered.' })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong finding the included services.',
  })
  @Public()
  @Get()
  async findAll(@Query() queryDTO: QueryDTO) {
    return await this.includedServicesService.findAll(queryDTO);
  }

  @ApiOperation({ summary: 'Find a included service by id.' })
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
  async findOne(@Param() param: IdValidator) {
    return await this.includedServicesService.findOne(param);
  }

  @ApiOperation({ summary: 'Update a included service.' })
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
  @ApiBody({ type: UpdateIncludedServiceDTO })
  async update(
    @Param() IdValidator: IdValidator,
    @Body() updateItineraryDTO: UpdateIncludedServiceDTO,
  ) {
    return await this.includedServicesService.update(
      IdValidator,
      updateItineraryDTO,
    );
  }

  @ApiOperation({ summary: 'Change a included service status by id.' })
  @ApiOkResponse({
    description: 'The included service status has been sucessfully changed.',
    type: String,
  })
  @ApiNotFoundResponse({
    description: 'Included service not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong changing the included service status.',
  })
  @ApiBadRequestResponse({
    description: 'The status is invalid.',
  })
  @Patch(':id/change-status')
  async delete(
    @Param() IdValidator: IdValidator,
    @Body() body: StatusDTO,
  ): Promise<string> {
    await this.includedServicesService.changeStatus(IdValidator, body);
    return 'The included service status has been sucessfully changed.';
  }
}
