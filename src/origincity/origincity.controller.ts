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
import { SearcherDTO } from '@/shared/enums/searcher/destination/searcher.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { excelFileFilter } from '@/filer/filer.utils';
import 'multer';
import { ResponseOriginCityDTO } from '@/shared/models/dtos/originCity/responseorigincity.dto';
import { ApiPaginatedResponse } from '@/shared/decorators/api-paginated.response.dto';
import { PaginatedDTO } from '@/shared/dtos/paginated.dto';

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
  @Get(':id')
  async findOne(
    @Param() urlValidator: UrlValidator,
  ): Promise<ResponseOriginCityDTO> {
    return await this.originCityService.findOne(urlValidator);
  }

  @ApiPaginatedResponse(ResponseOriginCityDTO)
  @ApiNotFoundResponse({ description: 'No origin cities registered.' })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong finding the origin cities.',
  })
  @Get()
  async findAll(
    @Query() queryDTO: QueryDTO,
  ): Promise<PaginateResult<OriginCity>> {
    return await this.originCityService.findAll(queryDTO);
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
  ): Promise<string> {
    await this.originCityService.update(urlValidator, updateOriginCityDTO);
    return 'The origin city has been successfully updated.';
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
  async search(@Body() searcherDTO: SearcherDTO): Promise<Array<OriginCity>> {
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
    type: [String],
  })
  async addPoints(
    @Param() urlValidator: UrlValidator,
    @Body() updateOriginCityDTO: UpdateOriginCityDTO,
  ): Promise<string> {
    await this.originCityService.addAboardPoints(
      urlValidator,
      updateOriginCityDTO,
    );
    return 'The aboard point/s has been successfully added to the origin city.';
  }

  @ApiExcludeEndpoint()
  @Post('load')
  @UseInterceptors(
    FileInterceptor('file', {
      dest: './uploads',
      fileFilter: excelFileFilter,
    }),
  )
  async loadCatalog(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<string> {
    await this.originCityService.loadFromExcel(file.path);
    return 'The origin cities has been successfully loaded.';
  }
}
