import { Status } from '@/shared/enums/status.enum';
import { CategoryLean } from '@/shared/interfaces/category/category.lean.interface';
import { CreateCategoryDTO } from '@/shared/models/dtos/request/category/createcategory.dto';
import { UpdateCategoryDTO } from '@/shared/models/dtos/request/category/updatecategory.dto';
import {
  Categories,
  CategoryDocument,
} from '@/shared/models/schemas/category.schema';
import { SubCategories } from '@/shared/models/schemas/subCategory.schema';
import { handleErrorsOnServices } from '@/shared/utilities/helpers';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Categories.name)
    private readonly categoryModel: Model<Categories>,
    @InjectModel(SubCategories.name)
    private readonly subCategoryModel: Model<SubCategories>,
  ) {}

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

  async delete(id: string): Promise<void> {
    try {
      const category = await this.findOne(id);
      if (!category) throw new NotFoundException('Category not found.');
      if (category.status === Status.INACTIVE)
        throw new BadRequestException('Category already deleted.');
      await this.categoryModel.findByIdAndUpdate(
        id,
        { status: Status.INACTIVE },
        {
          new: true,
        },
      );
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong while deleting category.',
        error,
      );
    }
  }

  async reactivate(id: string): Promise<void> {
    try {
      const category = await this.findOne(id);
      if (!category) throw new NotFoundException('Category not found.');
      if (category.status === Status.ACTIVE)
        throw new BadRequestException('Category already active.');
      await this.categoryModel.findByIdAndUpdate(
        id,
        { status: Status.ACTIVE },
        {
          new: true,
        },
      );
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong while reactivating category.',
        error,
      );
    }
  }

  async mapFromNameToObjectId(labels: string[]): Promise<string[] | undefined> {
    try {
      if (!labels?.length) {
        return;
      }

      const mappedCategoriesIds = await Promise.all(
        labels.map(async (label) => {
          const sanitizedLabel = label.trim();
          const category = await this.categoryModel
            .findOne({ label: sanitizedLabel })
            .lean()
            .exec();

          if (!category) {
            const createdCategory = await this.create({
              label: sanitizedLabel,
              status: Status.ACTIVE,
            });

            return createdCategory._id.toString();
          }

          return category._id.toString();
        }),
      );

      return mappedCategoriesIds;
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong mapping categories',
        error,
      );
    }
  }

  async insertCategoriesBunch(): Promise<void> {
    // This method is not implemented yet.
  }
}
