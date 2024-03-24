import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Status } from 'src/shared/enums/status.enum';

export class CreateCatalogDTO {
  @ApiProperty({
    description: 'Name of the catalog item',
    example: 'Catalog item name',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  name: string;

  @ApiProperty({
    description: 'Description of the catalog item',
    example: 'Catalog item description',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  description: string;

  @ApiPropertyOptional({
    enum: Status,
    description: 'Status of the catalog item',
    example: Status.ACTIVE,
  })
  @IsOptional()
  @IsString()
  status?: Status;

  constructor(name: string, description: string) {
    this.name = name;
    this.description = description;
  }
}
