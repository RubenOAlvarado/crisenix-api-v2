import { FilerService } from '@/filer/filer.service';
import { Status } from '@/shared/enums/status.enum';
import { CategoryLean } from '@/shared/interfaces/category/category.lean.interface';
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
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Categories.name)
    private readonly categoryModel: Model<Categories>,
    private filerService: FilerService,
  ) {}

  private readonly logger = new Logger(CategoryService.name);

  async create(
    createCategoryDTO: CreateCategoryDTO,
  ): Promise<CategoryDocument> {
    try {
      this.logger.debug(`creating new category`);
      const category = new this.categoryModel(createCategoryDTO);
      return await category.save();
    } catch (error) {
      this.logger.error(
        `Something went wrong while creating new category: ${error}`,
      );
      throw new InternalServerErrorException(
        'Something went wrong while creating new category',
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

  async loadFromExcel(file: Express.Multer.File): Promise<void> {
    try {
      const jsonObject = this.filerService.excelToJson(file.path);
      const categories: CreateCategoryDTO[] =
        this.mapJsonToCategory(jsonObject);
      await this.categoryModel.insertMany(categories);
    } catch (error) {
      this.logger.error(`Something went wrong while loading categories`);
      throw new InternalServerErrorException(
        'Something went wrong while loading categories',
      );
    }
  }

  private mapJsonToCategory(json: any): CreateCategoryDTO[] {
    return json.map((category: Categories) => {
      return {
        label: category.label,
        main: category.main,
        status: category.status,
      };
    });
  }

  async mapFromNameToObjectId(names: string[]): Promise<string[] | undefined> {
    try {
      if (!names.length) {
        return;
      }

      const mappedCategories = await Promise.all(
        names.map(async (name) => {
          const category = await this.categoryModel
            .findOne({ label: name })
            .lean();

          if (!category) {
            const createdCategory = await this.create({
              label: name,
              status: Status.ACTIVE,
            });

            return createdCategory._id.toString();
          }

          return category._id.toString();
        }),
      );

      return mappedCategories;
    } catch (error) {
      this.logger.error(`Error mapping from name to object id: ${error}`);
      throw new InternalServerErrorException(
        'Error mapping from name to object id',
      );
    }
  }
}
