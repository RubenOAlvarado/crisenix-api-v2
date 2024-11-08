import { Status } from '@/shared/enums/status.enum';
import { CategoryLean } from '@/shared/types/category/category.lean.type';
import { CreateCategoryDTO } from '@/shared/models/dtos/request/category/createcategory.dto';
import { UpdateCategoryDTO } from '@/shared/models/dtos/request/category/updatecategory.dto';
import {
  Categories,
  CategoryDocument,
} from '@/shared/models/schemas/category.schema';
import { handleErrorsOnServices } from '@/shared/utilities/helpers';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IdValidator } from '@/shared/models/dtos/validators/id.validator';
import { StatusDTO } from '@/shared/models/dtos/searcher/statusparam.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Categories.name)
    private readonly categoryModel: Model<Categories>,
  ) {}

  async validateCategory(id: string, status: string = Status.ACTIVE) {
    const category = await this.categoryModel.findById(id);
    if (!category) throw new NotFoundException('Category not found.');
    if (status === Status.INACTIVE && category.status !== Status.ACTIVE)
      throw new BadRequestException('Category is already inactive.');
    if (status === Status.ACTIVE && category.status !== Status.INACTIVE)
      throw new BadRequestException('Category is already active.');

    return category;
  }

  async create(
    createCategoryDTO: CreateCategoryDTO,
  ): Promise<CategoryDocument> {
    try {
      const category = new this.categoryModel(createCategoryDTO);
      return await category.save();
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong while creating category.',
        error,
      );
    }
  }

  async findAll(status?: string): Promise<Array<CategoryLean>> {
    try {
      const query = status ? { status } : {};
      const categories = await this.categoryModel
        .find(query)
        .select({ __v: 0, createdAt: 0 })
        .lean();
      if (!categories) throw new NotFoundException('No categories registered.');
      return categories;
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong while finding all categories',
        error,
      );
    }
  }

  async findOne(id: string): Promise<CategoryLean> {
    try {
      const category = await this.categoryModel.findById(id).lean();
      if (!category) throw new NotFoundException('Category not found.');
      return category;
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong while finding category.',
        error,
      );
    }
  }

  async update(
    id: string,
    updateCategoryDTO: UpdateCategoryDTO,
  ): Promise<CategoryLean> {
    try {
      const updatedCategory = await this.categoryModel.findByIdAndUpdate(
        id,
        updateCategoryDTO,
        {
          new: true,
        },
      );
      if (!updatedCategory) throw new NotFoundException('Category not found.');
      return updatedCategory;
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong while updating category.',
        error,
      );
    }
  }

  async changeStatus(
    { id }: IdValidator,
    { status }: StatusDTO,
  ): Promise<void> {
    try {
      const categoryToUpdate = await this.validateCategory(id, status);
      categoryToUpdate.status =
        status === Status.ACTIVE ? Status.ACTIVE : Status.INACTIVE;
      await categoryToUpdate.save();
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong while deleting category.',
        error,
      );
    }
  }

  async findMainCategories({
    status,
  }: StatusDTO): Promise<Array<CategoryLean>> {
    try {
      const categories = await this.categoryModel
        .find({ status, isRootCategory: true })
        .select({ __v: 0, createdAt: 0 })
        .lean();
      if (!categories) throw new NotFoundException('No main categories found.');
      return categories;
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong while finding main categories.',
        error,
      );
    }
  }

  async findByName(name?: string): Promise<CategoryLean | undefined | null> {
    try {
      if (!name) throw new BadRequestException('Category name is required.');
      const category = await this.categoryModel.findOne({ label: name }).lean();
      return category;
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong while finding category by name.',
        error,
      );
    }
  }

  async findParentCategoryByName(name?: string): Promise<string | undefined> {
    try {
      if (!name) throw new BadRequestException('Category name is required.');
      const category = await this.categoryModel
        .findOne({ label: name, isRootCategory: true })
        .lean();
      return !category ? undefined : category._id.toString();
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong while finding parent category by name.',
        error,
      );
    }
  }

  async insertBunch(categories: CreateCategoryDTO[]): Promise<void> {
    try {
      await this.categoryModel.insertMany(categories);
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong while inserting categories.',
        error,
      );
    }
  }
}
