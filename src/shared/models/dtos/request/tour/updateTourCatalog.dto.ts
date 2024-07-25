import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEnum, IsMongoId, IsNotEmpty } from 'class-validator';
import { TourCatalogs } from '@/shared/enums/tour/catalogs.enum';
import { Type } from 'class-transformer';

export class UpdateTourCatalogDTO {
  @ApiProperty({
    description: 'Tour ID to update.',
    example: '60d5f2b9c6b280b685d3e4e7',
  })
  @IsNotEmpty()
  @IsMongoId()
  tourId: string;

  @ApiProperty({
    description: 'The name of the catalog to look for.',
    example: TourCatalogs.COORDINATORS,
    enum: TourCatalogs,
  })
  @IsNotEmpty()
  @IsEnum(TourCatalogs)
  catalogName: TourCatalogs;

  @ApiProperty({
    description: 'The data to be updated.',
  })
  @IsNotEmpty()
  @IsDefined()
  @Type(() => Object)
  data: any;

  constructor(tourId: string, catalogName: TourCatalogs, data: any) {
    this.tourId = tourId;
    this.catalogName = catalogName;
    this.data = data;
  }
}
