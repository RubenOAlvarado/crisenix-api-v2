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
import { ClassificationService } from './classification.service';
import { Public } from '@/auth/public.decorator';
import { excelFileFilter } from '@/filer/filer.utils';
import { QueryDTO } from '@/shared/dtos/query.dto';
import { UrlValidator } from '@/shared/validators/urlValidator.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { plainToInstance } from 'class-transformer';
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
  async create(
    @Body() createClassificationDTO: CreateClassificationDTO,
  ): Promise<ResponseClassificationDTO> {
    const newclassification = await this.classificationService.create(
      createClassificationDTO,
    );
    return plainToInstance(ResponseClassificationDTO, newclassification);
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
  async findAll(
    @Query() { status }: QueryDTO,
  ): Promise<ResponseClassificationDTO[]> {
    const categories = await this.classificationService.findAll(status);
    return plainToInstance(ResponseClassificationDTO, categories);
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
  async findOne(
    @Param() { id }: UrlValidator,
  ): Promise<ResponseClassificationDTO> {
    const classification = await this.classificationService.findOne(id);
    return plainToInstance(ResponseClassificationDTO, classification);
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
  ): Promise<ResponseClassificationDTO> {
    const updatedclassification = await this.classificationService.update(
      id,
      updateclassificationDTO,
    );
    return plainToInstance(ResponseClassificationDTO, updatedclassification);
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

  @ApiExcludeEndpoint()
  @Post('load')
  @UseInterceptors(
    FileInterceptor('file', {
      dest: './uploads',
      fileFilter: excelFileFilter,
    }),
  )
  async load(@UploadedFile() file: Express.Multer.File) {
    return await this.classificationService.loadFromExcel(file);
  }
}
