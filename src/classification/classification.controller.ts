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
@Controller('classification')
export class ClassificationController {
  constructor(private readonly classificationService: ClassificationService) {}

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
  @Patch(':id/changes_status')
  async delete(
    @Param() param: IdValidator,
    @Query() query: StatusDTO,
  ): Promise<string> {
    await this.classificationService.changeStatus(param, query);
    return 'The classification was deleted successfully.';
  }
}
