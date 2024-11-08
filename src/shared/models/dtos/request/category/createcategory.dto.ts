import {
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoryDTO {
  @ApiProperty({
    description: 'Category label (name)',
    example: 'Internacionales',
    required: true,
  })
  @IsNotEmpty({ message: 'Category label is required.' })
  @IsString({ message: 'Category label must be a string.' })
  @MaxLength(150)
  label!: string;

  @ApiPropertyOptional({
    description: 'Parent category ID',
    example: '60f8f7b9c7b7d9001f1c2c5d',
  })
  @IsOptional()
  @IsMongoId({ message: 'Parent category ID must be a valid MongoID.' })
  parentCategory?: string;

  @ApiPropertyOptional({
    description: 'Root category flag',
    example: false,
    required: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'Root category flag must be a boolean.' })
  isRootCategory?: boolean;
}
