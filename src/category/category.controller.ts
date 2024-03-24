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
import { CategoryService } from './category.service';
import { QueryDTO } from '@/shared/dtos/query.dto';
import { UrlValidator } from '@/shared/validators/urlValidator.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { excelFileFilter } from '@/filer/filer.utils';
import { Public } from '@/auth/public.decorator';
import { ResponseCategoryDTO } from '@/shared/models/dtos/response/category/responsecategory.dto';
import { CreateCategoryDTO } from '@/shared/models/dtos/request/category/createcategory.dto';
import { UpdateCategoryDTO } from '@/shared/models/dtos/request/category/updatecategory.dto';

@ApiTags('Category')
@ApiBearerAuth()
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiCreatedResponse({
    description: 'Category created successfully.',
    type: ResponseCategoryDTO,
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong creating the category.',
  })
  @Post('create')
  @ApiBody({ description: 'Category object', type: CreateCategoryDTO })
  async create(@Body() createCategoryDTO: CreateCategoryDTO) {
    return await this.categoryService.create(createCategoryDTO);
  }

  @ApiOkResponse({
    description: 'Categories found successfully.',
    type: ResponseCategoryDTO,
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
    return await this.categoryService.findAll(status);
  }

  @ApiOkResponse({
    description: 'Category found successfully.',
    type: ResponseCategoryDTO,
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong finding category.',
  })
  @ApiNotFoundResponse({
    description: 'Category not found.',
  })
  @Get(':id')
  async findOne(@Param() { id }: UrlValidator) {
    return await this.categoryService.findOne(id);
  }

  @ApiOkResponse({
    description: 'Category updated successfully.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong updating category.',
  })
  @ApiNotFoundResponse({
    description: 'Category not found.',
  })
  @Put(':id')
  @ApiBody({ description: 'Category object', type: UpdateCategoryDTO })
  async update(
    @Param() { id }: UrlValidator,
    @Body() updateCategoryDTO: UpdateCategoryDTO,
  ) {
    return await this.categoryService.update(id, updateCategoryDTO);
  }

  @ApiOkResponse({
    description: 'Category deleted successfully.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong deleting category.',
  })
  @ApiNotFoundResponse({
    description: 'Category not found.',
  })
  @ApiBadRequestResponse({
    description: 'Category already deleted.',
  })
  @Delete(':id')
  async delete(@Param() { id }: UrlValidator) {
    await this.categoryService.delete(id);
  }

  @ApiOkResponse({
    description: 'Category activated successfully.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong activating category.',
  })
  @ApiNotFoundResponse({
    description: 'Category not found.',
  })
  @ApiBadRequestResponse({
    description: 'Category already active.',
  })
  @Patch('reactivate/:id')
  async reactivate(@Param() { id }: UrlValidator) {
    await this.categoryService.reactivate(id);
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
    return await this.categoryService.loadFromExcel(file);
  }
}
