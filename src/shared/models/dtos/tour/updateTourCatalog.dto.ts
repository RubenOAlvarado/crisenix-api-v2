import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateTourCatalogDTO {
  //TODO: improve this DTO to validate each case of the catalog
  @ApiProperty({
    description: 'The new value for the catalog.',
    isArray: true,
  })
  @IsNotEmpty()
  values: Array<any>;

  constructor(values: Array<any>) {
    this.values = values;
  }
}
