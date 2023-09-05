import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiExcludeEndpoint,
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
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { CreateOriginCityDTO } from 'src/shared/models/dtos/originCity/createorigincity.dto';
import { OriginCity } from 'src/shared/models/schemas/origincity.schema';
import { UrlValidator } from 'src/shared/validators/urlValidator.dto';
import { QueryDTO } from 'src/shared/dtos/query.dto';
import { PaginateResult } from 'src/shared/interfaces/paginate.interface';
import { UpdateOriginCityDTO } from 'src/shared/models/dtos/originCity/updateorigincity.dto';
import { SearcherDTO } from 'src/shared/dtos/searcher.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { excelFileFilter } from '@/filer/filer.utils';
import 'multer';
import { ResponseOriginCityDTO } from '@/shared/models/dtos/originCity/responseorigincity.dto';
import { ApiPaginatedResponse } from '@/shared/decorators/api-paginated.response.dto';
import { PaginatedDTO } from '@/shared/dtos/paginated.dto';
import { Public } from '@/auth/public.decorator';

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
  ): Promise<OriginCity> {
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
  @Public()
  @Get(':id')
  async findOne(@Param() urlValidator: UrlValidator): Promise<OriginCity> {
    const city = await this.originCityService.findOne(urlValidator);
    if (!city) throw new NotFoundException('Origin city not found.');
    return city;
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
  ): Promise<PaginateResult<OriginCity> | Array<OriginCity>> {
    const paginatedOriginCities = await this.originCityService.findAll(
      queryDTO,
    );
    if (!paginatedOriginCities)
      throw new NotFoundException('No origin cities registered.');
    return paginatedOriginCities;
  }

  @ApiOkResponse({
    description: 'The origin city has been successfully updated.',
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
  ): Promise<void> {
    await this.originCityService.update(urlValidator, updateOriginCityDTO);
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
  @Delete('delete/:id')
  async delete(@Param() urlValidator: UrlValidator): Promise<void> {
    await this.originCityService.delete(urlValidator);
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
  async reactivate(@Param() urlValidator: UrlValidator): Promise<void> {
    await this.originCityService.reactivate(urlValidator);
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
  async search(@Body() searcherDTO: SearcherDTO): Promise<Array<OriginCity>> {
    const searchResult = await this.originCityService.searcher(searcherDTO);
    if (!searchResult)
      throw new NotFoundException('Any origin city match your search.');
    return searchResult;
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
    type: [String],
  })
  async addPoints(
    @Param() urlValidator: UrlValidator,
    @Body() updateOriginCityDTO: UpdateOriginCityDTO,
  ): Promise<void> {
    await this.originCityService.addAboardPoints(
      urlValidator,
      updateOriginCityDTO,
    );
  }

  @ApiExcludeEndpoint()
  @Post('load')
  @UseInterceptors(
    FileInterceptor('file', {
      dest: './uploads',
      fileFilter: excelFileFilter,
    }),
  )
  async loadCatalog(@UploadedFile() file: Express.Multer.File): Promise<void> {
    await this.originCityService.loadFromExcel(file.path);
  }
}
