import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ResponseCategoryDTO {
  constructor(label: string, status: string, main?: string) {
    this.label = label;
    this.main = main;
    this.status = status;
  }

  @ApiProperty({
    description: 'Category label',
    type: String,
    example: 'Category 1',
  })
  label: string;

  @ApiPropertyOptional({
    description: 'Main category if exists',
    type: String,
    example: 'Category 1',
  })
  main?: string;

  @ApiProperty({
    description: 'Category status',
    type: String,
    example: 'Active',
  })
  status: string;
}
