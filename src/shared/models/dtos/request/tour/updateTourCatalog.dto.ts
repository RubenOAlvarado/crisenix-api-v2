import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEnum, IsNotEmpty } from 'class-validator';
import { TourCatalogs } from '@/shared/enums/tour/catalogs.enum';
import { Type } from 'class-transformer';

export class UpdateTourCatalogDTO {
  @ApiProperty({
    description: 'The name of the catalog to look for.',
    example: TourCatalogs.COORDINATORS,
    enum: TourCatalogs,
  })
  @IsNotEmpty()
  @IsEnum(TourCatalogs)
  catalogName!: TourCatalogs;

  @ApiProperty({
    description: 'The data to be updated.',
  })
  @IsNotEmpty()
  @IsDefined()
  @Type(() => Object)
  data!: any;
}
