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
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ClassificationService } from './classification.service';
import { Public } from '@/auth/public.decorator';
import { QueryDTO } from '@/shared/models/dtos/searcher/query.dto';
import { IdValidator } from '@/shared/models/dtos/validators/id.validator';
import { ResponseClassificationDTO } from '@/shared/models/dtos/response/classifications/responseclassifications.dto';
import { CreateClassificationDTO } from '@/shared/models/dtos/request/classification/createclassification.dto';
import { UpdateClassificationDTO } from '@/shared/models/dtos/request/classification/updateclasification.dto';
import { StatusDTO } from '@/shared/models/dtos/searcher/statusparam.dto';

@ApiTags('Classification')
@ApiBearerAuth()
@Controller('classifications')
export class ClassificationController {
  constructor(private readonly classificationService: ClassificationService) {}

  @ApiOperation({ summary: 'Create a new classification.' })
  @ApiCreatedResponse({
    description: 'Classification created successfully.',
    type: ResponseClassificationDTO,
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong creating the classification.',
  })
  @Post()
  @ApiBody({
    description: 'Classification object',
    type: CreateClassificationDTO,
  })
  async create(@Body() createClassificationDTO: CreateClassificationDTO) {
    return await this.classificationService.create(createClassificationDTO);
  }

  @ApiOperation({ summary: 'Find all classifications.' })
  @ApiOkResponse({
    description: 'Categories found successfully.',
    type: ResponseClassificationDTO,
    isArray: true,
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong finding all categories.',
  })
  @ApiNotFoundResponse({
    description: 'No categories found.',
  })
  @Public()
  @Get()
  async findAll(@Query() { status }: QueryDTO) {
    return await this.classificationService.findAll(status);
  }

  @ApiOperation({ summary: 'Find a classification by id.' })
  @ApiOkResponse({
    description: 'classification found successfully.',
    type: ResponseClassificationDTO,
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong finding classification.',
  })
  @ApiNotFoundResponse({
    description: 'classification not found.',
  })
  @Get(':id')
  async findOne(@Param() { id }: IdValidator) {
    return await this.classificationService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a classification by id.' })
  @ApiOkResponse({
    description: 'classification updated successfully.',
    type: ResponseClassificationDTO,
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong updating classification.',
  })
  @ApiNotFoundResponse({
    description: 'classification not found.',
  })
  @Put(':id')
  @ApiBody({
    description: 'classification object',
    type: UpdateClassificationDTO,
  })
  async update(
    @Param() { id }: IdValidator,
    @Body() updateclassificationDTO: UpdateClassificationDTO,
  ) {
    const updatedclassification = await this.classificationService.update(
      id,
      updateclassificationDTO,
    );
    return updatedclassification;
  }

  @ApiOperation({ summary: 'Change a classification status by id.' })
  @ApiOkResponse({
    description: 'The classification was deleted successfully.',
    type: String,
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong deleting classification.',
  })
  @ApiNotFoundResponse({
    description: 'classification not found.',
  })
  @ApiBadRequestResponse({
    description: 'classification already deleted.',
  })
  @Patch(':id/changes-status')
  async delete(
    @Param() param: IdValidator,
    @Query() query: StatusDTO,
  ): Promise<string> {
    await this.classificationService.changeStatus(param, query);
    return 'The classification was deleted successfully.';
  }
}
