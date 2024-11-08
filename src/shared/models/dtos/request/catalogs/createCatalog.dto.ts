import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Status } from 'src/shared/enums/status.enum';

export class CreateCatalogDTO {
  @ApiProperty({
    description: 'Name of the catalog item',
    example: 'Catalog item name',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  name!: string;

  @ApiPropertyOptional({
    description: 'Description of the catalog item',
    example: 'Catalog item description',
    required: false,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  description?: string;

  @ApiPropertyOptional({
    enum: Status,
    description: 'Status of the catalog item',
    example: Status.ACTIVE,
    required: false,
  })
  @IsOptional()
  @IsString()
  status?: Status;
}
