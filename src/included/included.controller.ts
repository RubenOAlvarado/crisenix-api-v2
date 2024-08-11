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
import { Public } from '@/auth/public.decorator';
import { UrlValidator } from '@/shared/validators/urlValidator.dto';
import { ApiPaginatedResponse } from '@/shared/decorators/api-paginated.response.dto';
import { QueryDTO } from '@/shared/dtos/query.dto';
import { ResponseIncludedDTO } from '@/shared/models/dtos/response/included/responseIncluded.dto';
import { CreateIncludedDTO } from '@/shared/models/dtos/request/included/createincluded.dto';
import { UpdateIncludedDTO } from '@/shared/models/dtos/request/included/updateincluded.dto';

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
  @ApiBody({ type: CreateIncludedDTO })
  @Post('create')
  async create(@Body() createIncludedDTO: CreateIncludedDTO) {
    return await this.includedService.create(createIncludedDTO);
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
  async findOne(@Param() urlValidator: UrlValidator) {
    return await this.includedService.findOne(urlValidator);
  }

  @ApiPaginatedResponse(ResponseIncludedDTO)
  @ApiNotFoundResponse({ description: 'No included services registered.' })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong finding the included services.',
  })
  @Public()
  @Get()
  async findAll(@Query() queryDTO: QueryDTO) {
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
  @ApiBody({ type: UpdateIncludedDTO })
  async update(
    @Param() urlValidator: UrlValidator,
    @Body() updateItineraryDTO: UpdateIncludedDTO,
  ) {
    return await this.includedService.update(urlValidator, updateItineraryDTO);
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
  async delete(@Param() urlValidator: UrlValidator): Promise<string> {
    await this.includedService.delete(urlValidator);
    return 'Included service deleted successfully.';
  }

  @ApiOkResponse({
    description: 'The included service has been reactivated.',
    type: String,
  })
  @ApiNotFoundResponse({
    description: 'Included service not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong reactivating the included service.',
  })
  @Patch('reactivate/:id')
  async reactivate(@Param() urlValidator: UrlValidator): Promise<string> {
    await this.includedService.reactivate(urlValidator);
    return 'Included service reactivated successfully.';
  }
}
