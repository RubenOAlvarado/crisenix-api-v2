import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsBoolean } from 'class-validator';

export class SubCatalogDto {
  @ApiProperty({
    description: 'Indicator if we want to load sub catalogs for destination.',
    default: false,
  })
  @IsNotEmpty()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  subCatalog!: boolean;
}
