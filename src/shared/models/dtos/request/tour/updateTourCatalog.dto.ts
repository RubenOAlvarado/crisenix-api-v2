import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { TourCatalogs } from '@/shared/enums/tour/catalogs.enum';

export class UpdateTourCatalogDTO {
  @ApiProperty({
    description: 'The name of the catalog to look for.',
    example: TourCatalogs.COORDINATORS,
    enum: TourCatalogs,
  })
  @IsNotEmpty()
  @IsEnum(TourCatalogs)
  catalogName: TourCatalogs;

  constructor(catalogName: TourCatalogs) {
    this.catalogName = catalogName;
  }
}
