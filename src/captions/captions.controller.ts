import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiExcludeEndpoint,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CaptionsService } from './captions.service';
import { ResponseAboardPointDTO } from '@/shared/models/dtos/aboardpoint/responseaboardpoint.dto';
import { CreateCaptionDTO } from '@/shared/models/dtos/captions/createcaption.dto';
import { Captions } from '@/shared/models/schemas/captions.schema';
import { QueryDTO } from '@/shared/dtos/query.dto';
import { UrlValidator } from '@/shared/validators/urlValidator.dto';
import { excelFileFilter } from '@/filer/filer.utils';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Captions')
@ApiBearerAuth()
@Controller('captions')
export class CaptionsController {
  constructor(private readonly captionService: CaptionsService) {}

  @ApiCreatedResponse({
    description: 'The caption has been successfully created.',
    type: ResponseAboardPointDTO,
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong creating the caption.',
  })
  @Post('create')
  @ApiBody({
    description: 'Caption object',
    type: CreateCaptionDTO,
  })
  async create(@Body() createCaptionDTO: CreateCaptionDTO): Promise<Captions> {
    return await this.captionService.create(createCaptionDTO);
  }

  @ApiOkResponse({
    description: 'All captions found.',
  })
  @ApiNotFoundResponse({
    description: 'No captions registered.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong finding all captions.',
  })
  @Get()
  async findAll(@Query() query: QueryDTO): Promise<Captions[]> {
    const captions = await this.captionService.findAll(query);
    if (!captions) throw new NotFoundException('No captions registered.');
    return captions;
  }

  @ApiOkResponse({
    description: 'Caption found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong finding the caption.',
  })
  @ApiNotFoundResponse({
    description: 'Caption not found.',
  })
  @Get(':id')
  async findOne(@Param() params: UrlValidator): Promise<Captions> {
    const caption = await this.captionService.findOne(params);
    if (!caption) throw new NotFoundException('Caption not found.');
    return caption;
  }

  @ApiOkResponse({
    description: 'Caption updated.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong updating the caption.',
  })
  @Put(':id')
  async update(
    @Param() params: UrlValidator,
    @Body() updateCaptionDTO: CreateCaptionDTO,
  ): Promise<void> {
    await this.captionService.update(params, updateCaptionDTO);
  }

  @ApiOkResponse({
    description: 'Caption deleted.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong deleting the caption.',
  })
  @Delete(':id')
  async delete(@Param() params: UrlValidator): Promise<void> {
    await this.captionService.delete(params);
  }

  @ApiOkResponse({
    description: 'Caption activated.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong activating the caption.',
  })
  @ApiNotFoundResponse({
    description: 'Caption not found.',
  })
  @ApiBadRequestResponse({
    description: 'Caption already active.',
  })
  @Put('reactivate/:id')
  async activate(@Param() params: UrlValidator): Promise<void> {
    await this.captionService.reactivate(params);
  }

  @ApiExcludeEndpoint()
  @Post('load')
  @UseInterceptors(
    FileInterceptor('file', {
      dest: './uploads',
      fileFilter: excelFileFilter,
    }),
  )
  async load(@UploadedFile() file: Express.Multer.File): Promise<void> {
    await this.captionService.loadFromExcel(file);
  }
}
