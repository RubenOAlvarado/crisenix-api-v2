import { PaginatedResponseDTO } from '@/shared/models/dtos/response/paginatedResponse.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
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
import { Public } from '@/auth/public.decorator';
import { IdValidator } from '@/shared/models/dtos/validators/id.validator';
import { ApiPaginatedResponse } from '@/shared/decorators/api-paginated.response.dto';
import { QueryDTO } from '@/shared/models/dtos/searcher/query.dto';
import { ResponseIncludedDTO } from '@/shared/models/dtos/response/included/responseIncluded.dto';
import { CreateIncludedServiceDTO } from '@/shared/models/dtos/request/included/createincluded.dto';
import { UpdateIncludedServiceDTO } from '@/shared/models/dtos/request/included/updateincluded.dto';
import { IncludedServicesService } from './includedServices.service';

@Controller('included-services')
@ApiTags('Included Services')
@ApiExtraModels(PaginatedResponseDTO)
export class IncludedServicesController {
  constructor(
    private readonly includedServicesService: IncludedServicesService,
  ) {}

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

  @ApiOkResponse({
    description: 'The included service has been deleted.',
    type: String,
  })
  @ApiNotFoundResponse({
    description: 'Included service not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong deleting the included service.',
  })
  @Delete(':id')
  async delete(@Param() IdValidator: IdValidator): Promise<string> {
    await this.includedServicesService.delete(IdValidator);
    return 'Included service deleted successfully.';
  }
}
