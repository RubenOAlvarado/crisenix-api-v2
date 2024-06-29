import { Status } from '@/shared/enums/status.enum';
import { CategoryLean } from '@/shared/interfaces/category/category.lean.interface';
import { CategoryExcel } from '@/shared/interfaces/excel/category.excel.interface';
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

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Categories.name)
    private readonly categoryModel: Model<Categories>,
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

  async mapFromNameToObjectId(labels: string[]): Promise<string[]> {
    try {
      if (!labels?.length) {
        throw new BadRequestException('No categories provided.');
      }
      const categories = [];
      for (const label of labels) {
        const sanitizedLabel = label.trim();
        const category = await this.categoryModel
          .findOne({ label: sanitizedLabel })
          .select({ _id: 1 })
          .lean();
        if (!category) {
          throw new NotFoundException(`Category ${label} not found.`);
        }
        categories.push(category._id.toString());
      }
      return categories;
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong mapping categories',
        error,
      );
    }
  }

  async insertCategoriesBunch(categorias: CategoryExcel[]): Promise<void> {
    try {
      const categoriesDTO: CreateCategoryDTO[] = this.mapDTO(categorias);
      await this.categoryModel.insertMany(categoriesDTO);
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong while inserting categories.',
        error,
      );
    }
  }

  private mapDTO(categories: CategoryExcel[]): CreateCategoryDTO[] {
    return categories.flatMap(({ nombre, subCategorias }) => {
      const label = nombre.trim();
      const subCategories = subCategorias
        ? this.mapSubCategories(label, subCategorias)
        : [];
      return [...subCategories, { label, status: Status.ACTIVE }];
    });
  }

  private mapSubCategories(
    main: string,
    subCategories: string,
  ): CreateCategoryDTO[] {
    return subCategories.split(',').map((subCategory) => ({
      label: subCategory.trim(),
      main,
      status: Status.ACTIVE,
    }));
  }
}
