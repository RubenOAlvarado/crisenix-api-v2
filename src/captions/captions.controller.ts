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
import { UrlValidator } from '@/shared/validators/urlValidator.dto';
import { excelFileFilter } from '@/filer/filer.utils';
import { FileInterceptor } from '@nestjs/platform-express';
import { StatusDTO } from '@/shared/dtos/statusparam.dto';
import { Public } from '@/auth/public.decorator';
import { CreateCaptionDTO } from '@/shared/models/dtos/request/captions/createcaption.dto';
import { ResponseCaptionsDTO } from '@/shared/models/dtos/response/captions/responseCaptions.dto';
import { UpdateCaptionDTO } from '@/shared/models/dtos/request/captions/updatecaption.dto';
import { plainToInstance } from 'class-transformer';

@ApiTags('Captions')
@ApiBearerAuth()
@Controller('captions')
export class CaptionsController {
  constructor(private readonly captionService: CaptionsService) {}

  @ApiCreatedResponse({
    description: 'The caption has been successfully created.',
    type: ResponseCaptionsDTO,
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong creating the caption.',
  })
  @Post('create')
  @ApiBody({
    description: 'Caption creation object',
    type: CreateCaptionDTO,
  })
  async create(
    @Body() createCaptionDTO: CreateCaptionDTO,
  ): Promise<ResponseCaptionsDTO> {
    const newCaption = await this.captionService.create(createCaptionDTO);
    return plainToInstance(ResponseCaptionsDTO, newCaption);
  }

  @ApiOkResponse({
    description: 'All captions found.',
    type: ResponseCaptionsDTO,
    isArray: true,
  })
  @ApiNotFoundResponse({
    description: 'No captions registered.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong finding all captions.',
  })
  @Public()
  @Get()
  async findAll(@Query() query: StatusDTO): Promise<ResponseCaptionsDTO[]> {
    const captions = await this.captionService.findAll(query);
    return plainToInstance(ResponseCaptionsDTO, captions);
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
  @Public()
  @Get(':id')
  async findOne(@Param() params: UrlValidator): Promise<ResponseCaptionsDTO> {
    const caption = await this.captionService.findOne(params);
    return plainToInstance(ResponseCaptionsDTO, caption);
  }

  @ApiOkResponse({
    description: 'Caption updated.',
    type: ResponseCaptionsDTO,
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
  ): Promise<ResponseCaptionsDTO> {
    const updatedCaption = await this.captionService.update(
      params,
      updateCaptionDTO,
    );
    return plainToInstance(ResponseCaptionsDTO, updatedCaption);
  }

  @ApiOkResponse({
    description: 'The caption has been successfully deleted.',
    type: String,
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong deleting the caption.',
  })
  @ApiNotFoundResponse({
    description: 'Caption not found.',
  })
  @Delete(':id')
  async delete(@Param() params: UrlValidator): Promise<string> {
    await this.captionService.delete(params);
    return 'The caption has been successfully deleted.';
  }

  @ApiOkResponse({
    description: 'The caption has been successfully deactivated.',
    type: String,
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
  async activate(@Param() params: UrlValidator): Promise<string> {
    await this.captionService.reactivate(params);
    return 'The caption has been successfully reactivated.';
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
