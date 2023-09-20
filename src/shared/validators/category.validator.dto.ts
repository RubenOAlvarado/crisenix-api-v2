import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CategoryValidator {
  @ApiProperty({
    description: 'Category name to look for.',
    example: 'Category 1',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  category: string;

  constructor(category: string) {
    this.category = category;
  }
}
