import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CaptionsService } from './captions.service';
import { IdValidator } from '@/shared/models/dtos/validators/id.validator';
import { StatusDTO } from '@/shared/models/dtos/searcher/statusparam.dto';
import { Public } from '@/auth/public.decorator';
import { CreateCaptionDTO } from '@/shared/models/dtos/request/captions/createcaption.dto';
import { ResponseCaptionsDTO } from '@/shared/models/dtos/response/captions/responseCaptions.dto';
import { UpdateCaptionDTO } from '@/shared/models/dtos/request/captions/updatecaption.dto';

@ApiTags('Captions')
@ApiBearerAuth()
@Controller('captions')
export class CaptionsController {
  constructor(private readonly captionService: CaptionsService) {}

  @ApiOperation({ summary: 'Create a new caption.' })
  @ApiCreatedResponse({
    description: 'The caption has been successfully created.',
    type: ResponseCaptionsDTO,
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong creating the caption.',
  })
  @Post()
  @ApiBody({
    description: 'Caption creation object',
    type: CreateCaptionDTO,
  })
  async create(@Body() createCaptionDTO: CreateCaptionDTO) {
    return await this.captionService.create(createCaptionDTO);
  }

  @ApiOperation({ summary: 'Find all captions.' })
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
  async findAll(@Query() query: StatusDTO) {
    return await this.captionService.findAll(query);
  }

  @ApiOperation({ summary: 'Find a caption by id.' })
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
  async findOne(@Param() params: IdValidator) {
    return await this.captionService.findOne(params);
  }

  @ApiOperation({ summary: 'Update a caption by id.' })
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
    @Param() params: IdValidator,
    @Body() updateCaptionDTO: UpdateCaptionDTO,
  ) {
    const updatedCaption = await this.captionService.update(
      params,
      updateCaptionDTO,
    );
    return updatedCaption;
  }

  @ApiOperation({ summary: 'Change a caption status by id.' })
  @ApiOkResponse({
    description: 'The caption status has been successfully changed.',
    type: String,
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong changing status of the caption.',
  })
  @ApiNotFoundResponse({
    description: 'Caption not found.',
  })
  @Patch(':id/changes-status')
  async delete(
    @Param() params: IdValidator,
    @Query() query: StatusDTO,
  ): Promise<string> {
    await this.captionService.changeStatus(params, query);
    return 'The caption status has been successfully changed.';
  }
}
