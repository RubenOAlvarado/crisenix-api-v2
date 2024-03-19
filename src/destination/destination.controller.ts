import { PaginatedDTO } from '@/shared/dtos/paginated.dto';
import { ResponseDestinationDTO } from '@/shared/models/dtos/destination/responsedestination.dto';
import { UrlValidator } from '@/shared/validators/urlValidator.dto';
import {
  Controller,
  Get,
  Param,
  Body,
  Post,
  Query,
  Put,
  Delete,
  Patch,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiExcludeEndpoint,
  ApiExtraModels,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { DestinationService } from './destination.service';
import { Public } from '@/auth/public.decorator';
import { SearcherDTO } from '@/shared/enums/searcher/destination/searcher.dto';
import { CreateDestinationDTO } from '@/shared/models/dtos/destination/createdestination.dto';
import { ApiPaginatedResponse } from '@/shared/decorators/api-paginated.response.dto';
import { QueryDTO } from '@/shared/dtos/query.dto';
import { PaginateResult } from '@/shared/interfaces/paginate.interface';
import { UpdateDestinationDTO } from '@/shared/models/dtos/destination/updatedestination.dto';
import { PhotoValidator } from '@/shared/validators/photo.validator';
import { ResponseOriginCityDTO } from '@/shared/models/dtos/originCity/responseorigincity.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { excelFileFilter } from '@/filer/filer.utils';
import 'multer';
import { PaginationDTO } from '@/shared/dtos/pagination.dto';

@Controller('destination')
@ApiTags('Destination')
@ApiExtraModels(PaginatedDTO)
export class DestinationController {
  constructor(private readonly destinationService: DestinationService) {}

  @ApiCreatedResponse({
    description: 'The destination has been created.',
    type: ResponseDestinationDTO,
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong creating the destination.',
  })
  @ApiBody({ type: CreateDestinationDTO })
  @Public()
  @Post('/create')
  async create(
    @Body() createDestinationDTO: CreateDestinationDTO,
  ): Promise<ResponseDestinationDTO> {
    return await this.destinationService.create(createDestinationDTO);
  }

  @ApiPaginatedResponse(ResponseDestinationDTO)
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong finding the destinations.',
  })
  @ApiNotFoundResponse({
    description: 'Destinations not found.',
  })
  @Public()
  @Get()
  async findAll(
    @Query() queryDTO: QueryDTO,
  ): Promise<PaginateResult<ResponseDestinationDTO>> {
    return await this.destinationService.findAll(queryDTO);
  }

  @ApiOkResponse({
    description: 'The destination has been found.',
    type: ResponseDestinationDTO,
  })
  @ApiNotFoundResponse({
    description: 'Destination not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong finding the destination.',
  })
  @Get(':id')
  async findOne(
    @Param() urlValidator: UrlValidator,
  ): Promise<ResponseDestinationDTO> {
    return await this.destinationService.findOne(urlValidator);
  }

  @ApiOkResponse({
    description: 'The destination have been found.',
    type: ResponseDestinationDTO,
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong finding the destination.',
  })
  @ApiNotFoundResponse({
    description: 'Destination not found.',
  })
  @Get('web/:id')
  async findOneWeb(
    @Param() urlValidator: UrlValidator,
  ): Promise<ResponseDestinationDTO> {
    return await this.destinationService.findOneWeb(urlValidator);
  }

  @ApiOkResponse({
    description: 'Destination successfully updated.',
    type: ResponseDestinationDTO,
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong updating the destination.',
  })
  @ApiNotFoundResponse({
    description: 'Destination not found.',
  })
  @ApiBody({ type: UpdateDestinationDTO })
  @Put('/:id')
  async update(
    @Param() urlValidator: UrlValidator,
    @Body() updateDestinationDTO: UpdateDestinationDTO,
  ): Promise<ResponseDestinationDTO> {
    return await this.destinationService.update(
      urlValidator,
      updateDestinationDTO,
    );
  }

  @ApiOkResponse({
    description: 'Destination successfully deleted.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong deleting the destination.',
  })
  @ApiNotFoundResponse({
    description: 'Destination not found.',
  })
  @Delete('/:id')
  async delete(@Param() urlValidator: UrlValidator): Promise<string> {
    await this.destinationService.delete(urlValidator);
    return 'Destination successfully deleted.';
  }

  @ApiOkResponse({
    description: 'Destination successfully reactivated.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong reactivating the destination.',
  })
  @ApiNotFoundResponse({
    description: 'Destination not found.',
  })
  @Patch('reactivate/:id')
  async reactivate(@Param() urlValidator: UrlValidator): Promise<string> {
    await this.destinationService.reactivate(urlValidator);
    return 'Destination successfully reactivated.';
  }

  @ApiPaginatedResponse(ResponseDestinationDTO)
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong searching the destinations.',
  })
  @ApiNotFoundResponse({
    description: 'Destinations not found.',
  })
  @Public()
  @Post('/search')
  @ApiBody({
    description: 'Search params in destinations catalog',
    type: SearcherDTO,
  })
  async search(
    @Body() searcherDTO: SearcherDTO,
    @Query() queryDTO: PaginationDTO,
  ) {
    return await this.destinationService.search(searcherDTO, queryDTO);
  }

  @ApiOkResponse({
    description: 'Destination photos successfully deleted.',
    type: String,
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong deleting the destination photos.',
  })
  @ApiNotFoundResponse({
    description: 'Destination not found.',
  })
  @ApiBadRequestResponse({
    description: 'Destination must be in Active status.',
  })
  @Patch('deletephoto')
  @ApiBody({
    description: 'Destination and photo to delete',
    type: PhotoValidator,
  })
  async deletePhoto(@Body() photoValidator: PhotoValidator): Promise<string> {
    await this.destinationService.deletePhotos(photoValidator);
    return 'Destination photos successfully deleted.';
  }

  @ApiOkResponse({
    description: 'Destination cities found.',
    type: ResponseOriginCityDTO,
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong finding the destination cities.',
  })
  @ApiNotFoundResponse({
    description: 'Destination not found.',
  })
  @Public()
  @Get('cities/:id')
  async findCities(
    @Param() urlValidator: UrlValidator,
  ): Promise<ResponseOriginCityDTO> {
    return await this.destinationService.findCities(urlValidator);
  }

  @ApiExcludeEndpoint()
  @Post('load')
  @UseInterceptors(
    FileInterceptor('file', {
      dest: './uploads',
      fileFilter: excelFileFilter,
    }),
  )
  async load(@UploadedFile() file: Express.Multer.File): Promise<string> {
    await this.destinationService.loadCatalog(file.path);
    return 'The destination catalog was successfully created.';
  }
}
