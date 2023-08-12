import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { OriginCityService } from './origincity.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
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

@Controller('origincity')
@ApiTags('Origin City')
export class OriginCityController {
  constructor(private readonly originCityService: OriginCityService) {}

  @ApiResponse({ status: HttpStatus.CREATED })
  @Post('create')
  async create(
    @Body() createOriginCityDTO: CreateOriginCityDTO,
  ): Promise<OriginCity> {
    return await this.originCityService.create(createOriginCityDTO);
  }

  @ApiResponse({ status: HttpStatus.OK })
  @Get(':id')
  async findOne(@Param() urlValidator: UrlValidator): Promise<OriginCity> {
    const city = await this.originCityService.findOne(urlValidator);
    if (!city) throw new NotFoundException('Origin city not found');
    return city;
  }

  @ApiResponse({ status: HttpStatus.OK })
  @Get()
  async findAll(
    @Query() queryDTO: QueryDTO,
  ): Promise<PaginateResult<OriginCity> | Array<OriginCity>> {
    const cities = await this.originCityService.findAll(queryDTO);
    if (!cities) throw new NotFoundException('No origin cities found');
    return cities;
  }

  @Put(':id')
  async update(
    @Param() urlValidator: UrlValidator,
    @Body() updateOriginCityDTO: UpdateOriginCityDTO,
  ): Promise<void> {
    await this.originCityService.update(urlValidator, updateOriginCityDTO);
  }

  @ApiResponse({ status: HttpStatus.OK })
  @Delete('delete/:id')
  async delete(@Param() urlValidator: UrlValidator): Promise<void> {
    await this.originCityService.delete(urlValidator);
  }

  @ApiResponse({ status: HttpStatus.OK })
  @Patch('reactivate/:id')
  async reactivate(@Param() urlValidator: UrlValidator): Promise<void> {
    await this.originCityService.reactivate(urlValidator);
  }

  @ApiResponse({ status: HttpStatus.OK })
  @Post('search')
  async search(@Body() searcherDTO: SearcherDTO): Promise<Array<OriginCity>> {
    const searchResult = await this.originCityService.searcher(searcherDTO);
    if (!searchResult) throw new NotFoundException('No origin city found');
    return searchResult;
  }

  @ApiResponse({ status: HttpStatus.OK })
  @Patch('addpoints/:id')
  async addPoints(
    @Param() urlValidator: UrlValidator,
    @Body() updateOriginCityDTO: UpdateOriginCityDTO,
  ): Promise<void> {
    await this.originCityService.addAboardPoints(
      urlValidator,
      updateOriginCityDTO,
    );
  }

  @ApiResponse({ status: HttpStatus.CREATED })
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
