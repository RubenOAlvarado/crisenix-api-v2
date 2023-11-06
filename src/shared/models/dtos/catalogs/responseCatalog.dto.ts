import { ApiProperty } from '@nestjs/swagger';

export class ResponseCatalogDTO {
  @ApiProperty({
    description: 'Name of the catalog item',
    example: 'Catalog item name',
  })
  name: string;

  @ApiProperty({
    description: 'Description of the catalog item',
    example: 'Catalog item description',
  })
  description: string;

  @ApiProperty({
    description: 'Status of the catalog item',
    example: 'Catalog item status',
  })
  status: string;

  constructor(name: string, description: string, status: string) {
    this.name = name;
    this.description = description;
    this.status = status;
  }
}
