import { TourCatalogs } from '@/shared/enums/tour/catalogs.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsMongoId, IsNotEmpty } from 'class-validator';

export class GetTourCatalogDTO {
  @ApiProperty({
    description: 'The id of the tour to look for (it is mongo id).',
    example: '5f9d7a3b9d3e9e1b7c9b4b1c',
  })
  @IsNotEmpty()
  @IsMongoId()
  id: string;

  @ApiProperty({
    description: 'The name of the catalog to look for.',
    example: TourCatalogs.COORDINATORS,
    enum: TourCatalogs,
  })
  @IsNotEmpty()
  @IsEnum(TourCatalogs)
  catalogName: TourCatalogs;

  constructor(id: string, catalogName: TourCatalogs) {
    this.id = id;
    this.catalogName = catalogName;
  }
}
