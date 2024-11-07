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
import { CategoryService } from './category.service';
import { QueryDTO } from '@/shared/models/dtos/searcher/query.dto';
import { IdValidator } from '@/shared/models/dtos/validators/id.validator';
import { Public } from '@/auth/public.decorator';
import { ResponseCategoryDTO } from '@/shared/models/dtos/response/category/responsecategory.dto';
import { CreateCategoryDTO } from '@/shared/models/dtos/request/category/createcategory.dto';
import { UpdateCategoryDTO } from '@/shared/models/dtos/request/category/updatecategory.dto';
import { StatusDTO } from '@/shared/models/dtos/searcher/statusparam.dto';

@ApiTags('Category')
@ApiBearerAuth()
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiOperation({ summary: 'Create a new category.' })
  @ApiCreatedResponse({
    description: 'Category created successfully.',
    type: ResponseCategoryDTO,
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong creating the category.',
  })
  @Post()
  @ApiBody({ description: 'Category object', type: CreateCategoryDTO })
  async create(@Body() createCategoryDTO: CreateCategoryDTO) {
    return await this.categoryService.create(createCategoryDTO);
  }

  @ApiOperation({ summary: 'Find all categories.' })
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

  @ApiOperation({ summary: 'Find all main categories.' })
  @ApiOkResponse({
    description: 'Main categories found successfully.',
    type: ResponseCategoryDTO,
    isArray: true,
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong finding main categories.',
  })
  @ApiNotFoundResponse({
    description: 'No main categories found.',
  })
  @Public()
  @Get('main')
  async findMainCategories(@Query() query: StatusDTO) {
    return await this.categoryService.findMainCategories(query);
  }

  @ApiOperation({ summary: 'Find a category by id.' })
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
  async findOne(@Param() { id }: IdValidator) {
    return await this.categoryService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a category by id.' })
  @ApiOkResponse({
    description: 'Category updated successfully.',
    type: ResponseCategoryDTO,
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
    @Param() { id }: IdValidator,
    @Body() updateCategoryDTO: UpdateCategoryDTO,
  ) {
    const updatedCategory = await this.categoryService.update(
      id,
      updateCategoryDTO,
    );
    return updatedCategory;
  }

  @ApiOperation({ summary: 'Change category status by id.' })
  @ApiOkResponse({
    description: 'The category status was changed successfully.',
    type: String,
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong changing category status.',
  })
  @ApiNotFoundResponse({
    description: 'Category not found.',
  })
  @ApiBadRequestResponse({
    description: 'Wrong status.',
  })
  @Patch(':id/changes-status')
  async delete(
    @Param() param: IdValidator,
    @Query() query: StatusDTO,
  ): Promise<string> {
    await this.categoryService.changeStatus(param, query);
    return 'The category status was changed successfully.';
  }
}
