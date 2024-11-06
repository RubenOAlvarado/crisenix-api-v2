import { TourCatalogs } from '@/shared/enums/tour/catalogs.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class GetTourCatalogDTO {
  @ApiProperty({
    description: 'The name of the catalog to look for.',
    example: TourCatalogs.COORDINATORS,
    enum: TourCatalogs,
  })
  @IsNotEmpty()
  @IsEnum(TourCatalogs)
  catalogName!: TourCatalogs;
}
