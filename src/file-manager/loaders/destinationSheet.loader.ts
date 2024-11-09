import { CreateDestinationDTO } from '@/shared/models/dtos/request/destination/createdestination.dto';
import { BaseSheetLoader } from '../baseSheetLoader';
import { DestinationService } from '@/destination/destination.service';
import { CatalogSheetNames } from '@/shared/enums/file-manager/catalogsSheetNames.enum';
import { WorkSheet } from 'xlsx';
import { DestinationsExcel } from '@/shared/interfaces/excel/destinations.excel.interface';
import { CategoryService } from '@/category/category.service';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class DestinationSheetLoader extends BaseSheetLoader<CreateDestinationDTO> {
  constructor(
    destinationService: DestinationService,
    private categoryService: CategoryService,
  ) {
    super(destinationService, CatalogSheetNames.DESTINATIONS);
  }

  protected override async transformSheet(
    sheet: WorkSheet,
  ): Promise<CreateDestinationDTO[]> {
    const destinationsFromExcel = (await super.transformSheet(
      sheet,
    )) as DestinationsExcel[];
    return this.transformDestinations(destinationsFromExcel);
  }

  private async transformDestinations(
    destinationsFromExcel: DestinationsExcel[],
  ): Promise<CreateDestinationDTO[]> {
    const transformedDestinations: CreateDestinationDTO[] = [];
    for (const {
      codigo,
      nombre,
      descripcion,
      categorias,
      fechasProgramadas,
      traslado,
    } of destinationsFromExcel) {
      const categories = await this.getOrCreateCategory(categorias);
      transformedDestinations.push({
        code: codigo,
        name: nombre,
        description: descripcion,
        categories,
        tentativeDates: fechasProgramadas,
        transportation: traslado,
      });
    }
    return transformedDestinations;
  }

  private async getOrCreateCategory(categories: string): Promise<string[]> {
    const transformedCategories: string[] = [];
    const categoriesLabels = categories
      .split(',')
      .map((category) => category.trim());
    for (const categoryLabel of categoriesLabels) {
      const category = await this.categoryService.findByName(categoryLabel);
      if (!category)
        throw new BadRequestException(`Category ${categoryLabel} not found.`);
      transformedCategories.push(category._id.toString());
    }
    return transformedCategories;
  }
}
