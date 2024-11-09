import { CategoryService } from '@/category/category.service';
import { CatalogSheetNames } from '@/shared/enums/file-manager/catalogsSheetNames.enum';
import { CategoryExcel } from '@/shared/interfaces/excel/category.excel.interface';
import { CreateCategoryDTO } from '@/shared/models/dtos/request/category/createcategory.dto';
import { WorkSheet } from 'xlsx';
import { BaseSheetLoader } from '../baseSheetLoader';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CategorySheetLoader extends BaseSheetLoader<CreateCategoryDTO> {
  constructor(private categoryService: CategoryService) {
    super(categoryService, CatalogSheetNames.CATEGORIES);
  }

  protected override async transformSheet(
    sheet: WorkSheet,
  ): Promise<CreateCategoryDTO[]> {
    const categoriesFromExcel = (await super.transformSheet(
      sheet,
    )) as CategoryExcel[];
    return await this.transformCategories(categoriesFromExcel);
  }

  private async transformCategories(
    categoriesFromExcel: CategoryExcel[],
  ): Promise<CreateCategoryDTO[]> {
    const transformedCategories: CreateCategoryDTO[] = [];

    for (const { nombre, categoriaPadre } of categoriesFromExcel) {
      const parentCategory = await this.getOrCreateCategory(
        nombre,
        categoriaPadre,
      );

      transformedCategories.push({
        label: nombre,
        parentCategory,
        isRootCategory: !parentCategory ? true : false,
      });
    }

    return transformedCategories;
  }

  private async getOrCreateCategory(
    name: string,
    parentCategoryName?: string,
  ): Promise<string> {
    const category = await this.categoryService.findByName(name);

    if (!category) {
      const parentCategory = parentCategoryName
        ? await this.categoryService.findParentCategoryByName(
            parentCategoryName,
          )
        : undefined;

      const newCategory = await this.categoryService.create({
        label: name,
        parentCategory,
        isRootCategory: !parentCategory ? true : false,
      });

      return newCategory._id.toString();
    }

    return category._id.toString();
  }
}
