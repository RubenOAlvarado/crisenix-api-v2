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
  @Post()
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
  async findOne(@Param() { id }: IdValidator) {
    return await this.categoryService.findOne(id);
  }

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
  @Patch(':id/changes_status')
  async delete(
    @Param() param: IdValidator,
    @Query() query: StatusDTO,
  ): Promise<string> {
    await this.categoryService.changeStatus(param, query);
    return 'The category status was changed successfully.';
  }
}
