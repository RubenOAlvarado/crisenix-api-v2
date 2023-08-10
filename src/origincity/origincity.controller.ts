import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { OriginCityService } from './origincity.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CreateOriginCityDTO } from 'src/shared/models/dtos/originCity/createorigincity.dto';
import { OriginCity } from 'src/shared/models/schemas/origincity.schema';
import { UrlValidator } from 'src/shared/validators/urlValidator.dto';
import { QueryDTO } from 'src/shared/dtos/query.dto';
import { PaginateResult } from 'src/shared/interfaces/paginate.interface';
import { UpdateOriginCityDTO } from 'src/shared/models/dtos/originCity/updateorigincity.dto';
import { SearcherDTO } from 'src/shared/dtos/searcher.dto';

@Controller('origincity')
@ApiTags('Origin City')
export class OriginCityController {
  constructor(private readonly originCityService: OriginCityService) {}

  @ApiResponse({ status: HttpStatus.CREATED })
  @Post('create')
  async create(
    @Body() createOriginCityDTO: CreateOriginCityDTO,
  ): Promise<OriginCity> {
    return this.originCityService.create(createOriginCityDTO);
  }

  @ApiResponse({ status: HttpStatus.OK })
  @Get(':id')
  async findOne(@Param() urlValidator: UrlValidator): Promise<OriginCity> {
    return this.originCityService.findOne(urlValidator);
  }

  @ApiResponse({ status: HttpStatus.OK })
  @Get()
  async findAll(
    @Query() queryDTO: QueryDTO,
  ): Promise<PaginateResult<OriginCity> | Array<OriginCity>> {
    return this.originCityService.findAll(queryDTO);
  }

  @Put(':id')
  async update(
    @Param() urlValidator: UrlValidator,
    @Body() updateOriginCityDTO: UpdateOriginCityDTO,
  ): Promise<OriginCity> {
    return this.originCityService.update(urlValidator, updateOriginCityDTO);
  }

  @ApiResponse({ status: HttpStatus.OK })
  @Delete('delete/:id')
  async delete(@Param() urlValidator: UrlValidator): Promise<OriginCity> {
    return this.originCityService.delete(urlValidator);
  }

  @ApiResponse({ status: HttpStatus.OK })
  @Patch('reactivate/:id')
  async reactivate(@Param() urlValidator: UrlValidator): Promise<OriginCity> {
    return this.originCityService.reactivate(urlValidator);
  }

  @ApiResponse({ status: HttpStatus.OK })
  @Post('search')
  async search(@Body() searcherDTO: SearcherDTO): Promise<Array<OriginCity>> {
    return this.originCityService.searcher(searcherDTO);
  }

  @ApiResponse({ status: HttpStatus.OK })
  @Patch('addpoints/:id')
  async addPoints(
    @Param() urlValidator: UrlValidator,
    @Body() updateOriginCityDTO: UpdateOriginCityDTO,
  ): Promise<OriginCity> {
    return this.originCityService.addAboardPoints(
      urlValidator,
      updateOriginCityDTO,
    );
  }
}
