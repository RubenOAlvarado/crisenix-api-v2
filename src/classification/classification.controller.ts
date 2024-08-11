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
import { QueryDTO } from '@/shared/dtos/query.dto';
import { UrlValidator } from '@/shared/validators/urlValidator.dto';
import { ResponseClassificationDTO } from '@/shared/models/dtos/response/classifications/responseclassifications.dto';
import { CreateClassificationDTO } from '@/shared/models/dtos/request/classification/createclassification.dto';
import { UpdateClassificationDTO } from '@/shared/models/dtos/request/classification/updateclasification.dto';

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
  @Post('create')
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
  async findOne(@Param() { id }: UrlValidator) {
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
    @Param() { id }: UrlValidator,
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
  @Delete(':id')
  async delete(@Param() { id }: UrlValidator): Promise<string> {
    await this.classificationService.delete(id);
    return 'The classification was deleted successfully.';
  }

  @ApiOkResponse({
    description: 'The classification was reactivated successfully.',
    type: String,
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong activating classification.',
  })
  @ApiNotFoundResponse({
    description: 'classification not found.',
  })
  @ApiBadRequestResponse({
    description: 'classification already active.',
  })
  @Patch('reactivate/:id')
  async reactivate(@Param() { id }: UrlValidator): Promise<string> {
    await this.classificationService.reactivate(id);
    return 'The classification was reactivated successfully.';
  }
}
