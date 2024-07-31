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
import { UrlValidator } from 'src/shared/validators/urlValidator.dto';
import { QueryDTO } from 'src/shared/dtos/query.dto';
import { SearcherDTO } from '@/shared/enums/searcher/destination/searcher.dto';
import 'multer';
import { ApiPaginatedResponse } from '@/shared/decorators/api-paginated.response.dto';
import { PaginatedDTO } from '@/shared/dtos/paginated.dto';
import { Public } from '@/auth/public.decorator';
import { ResponseOriginCityDTO } from '@/shared/models/dtos/response/origincity/responseorigincity.dto';
import { CreateOriginCityDTO } from '@/shared/models/dtos/request/originCity/createorigincity.dto';
import { UpdateOriginCityDTO } from '@/shared/models/dtos/request/originCity/updateorigincity.dto';
import { AddAboardPointsDTO } from '@/shared/models/dtos/request/originCity/add-aboard-points.dto';
import { plainToInstance } from 'class-transformer';

@ApiBearerAuth()
@Controller('origincity')
@ApiTags('Origin City')
@ApiExtraModels(PaginatedDTO)
export class OriginCityController {
  constructor(private readonly originCityService: OriginCityService) {}

  @ApiCreatedResponse({
    description: 'The origin city has been successfully created.',
    type: ResponseOriginCityDTO,
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong creating the origin city.',
  })
  @Post('create')
  @ApiBody({
    description: 'Origin city object',
    type: CreateOriginCityDTO,
  })
  async create(
    @Body() createOriginCityDTO: CreateOriginCityDTO,
  ): Promise<ResponseOriginCityDTO> {
    const newCity = await this.originCityService.create(createOriginCityDTO);
    return plainToInstance(ResponseOriginCityDTO, newCity);
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
  async findOne(
    @Param() urlValidator: UrlValidator,
  ): Promise<ResponseOriginCityDTO> {
    const city = await this.originCityService.findOne(urlValidator);
    return plainToInstance(ResponseOriginCityDTO, city);
  }

  @ApiPaginatedResponse(ResponseOriginCityDTO)
  @ApiNotFoundResponse({ description: 'No origin cities registered.' })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong finding the origin cities.',
  })
  @Public()
  @Get()
  async findAll(
    @Query() queryDTO: QueryDTO,
  ): Promise<PaginatedDTO<ResponseOriginCityDTO>> {
    const { docs, page, totalDocs, totalPages, hasNextPage, hasPrevPage } =
      await this.originCityService.findAll(queryDTO);
    const transformedDTO = plainToInstance(ResponseOriginCityDTO, docs);
    return new PaginatedDTO<ResponseOriginCityDTO>(
      transformedDTO,
      totalDocs,
      hasPrevPage,
      hasNextPage,
      totalPages,
      page,
    );
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
    @Param() urlValidator: UrlValidator,
    @Body() updateOriginCityDTO: UpdateOriginCityDTO,
  ): Promise<ResponseOriginCityDTO> {
    const updatedCity = await this.originCityService.update(
      urlValidator,
      updateOriginCityDTO,
    );
    return plainToInstance(ResponseOriginCityDTO, updatedCity);
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
  async delete(@Param() urlValidator: UrlValidator): Promise<string> {
    await this.originCityService.delete(urlValidator);
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
  async reactivate(@Param() urlValidator: UrlValidator): Promise<string> {
    await this.originCityService.reactivate(urlValidator);
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
  @Post('search')
  @ApiBody({
    description: 'Searcher object',
    type: SearcherDTO,
  })
  async search(@Body() searcherDTO: SearcherDTO): Promise<Array<OriginCities>> {
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
    @Param() urlValidator: UrlValidator,
    @Body() aboardPointsDTO: AddAboardPointsDTO,
  ): Promise<string> {
    await this.originCityService.addAboardPoints(urlValidator, aboardPointsDTO);
    return 'The aboard point/s has been successfully added to the origin city.';
  }
}
