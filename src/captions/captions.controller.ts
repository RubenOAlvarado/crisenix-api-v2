import {
  Body,
  Controller,
  Delete,
  Get,
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
import { Captions } from '@/shared/models/schemas/captions.schema';
import { UrlValidator } from '@/shared/validators/urlValidator.dto';
import { excelFileFilter } from '@/filer/filer.utils';
import { FileInterceptor } from '@nestjs/platform-express';
import { StatusDTO } from '@/shared/dtos/statusparam.dto';
import { Public } from '@/auth/public.decorator';
import { ResponseAboardPointDTO } from '@/shared/models/dtos/response/aboardpoint/responseaboardpoint.dto';
import { CreateCaptionDTO } from '@/shared/models/dtos/request/captions/createcaption.dto';
import { ResponseCaptionsDTO } from '@/shared/models/dtos/response/captions/responseCaptions.dto';
import { UpdateCaptionDTO } from '@/shared/models/dtos/request/captions/updatecaption.dto';

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
    description: 'Caption creation object',
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
  @Public()
  @Get()
  async findAll(@Query() query: StatusDTO) {
    return await this.captionService.findAll(query);
  }

  @ApiOkResponse({
    description: 'Caption found.',
    type: ResponseCaptionsDTO,
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong finding the caption.',
  })
  @ApiNotFoundResponse({
    description: 'Caption not found.',
  })
  @Get(':id')
  async findOne(@Param() params: UrlValidator) {
    return await this.captionService.findOne(params);
  }

  @ApiOkResponse({
    description: 'Caption updated.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong updating the caption.',
  })
  @ApiNotFoundResponse({
    description: 'Caption not found.',
  })
  @Put(':id')
  @ApiBody({
    description: 'Caption update object',
    type: UpdateCaptionDTO,
  })
  async update(
    @Param() params: UrlValidator,
    @Body() updateCaptionDTO: UpdateCaptionDTO,
  ) {
    return await this.captionService.update(params, updateCaptionDTO);
  }

  @ApiOkResponse({
    description: 'Caption deleted.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong deleting the caption.',
  })
  @ApiNotFoundResponse({
    description: 'Caption not found.',
  })
  @Delete(':id')
  async delete(@Param() params: UrlValidator) {
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
  async activate(@Param() params: UrlValidator) {
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
