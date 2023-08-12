import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CategoryValidator {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  category: string;

  constructor(category: string) {
    this.category = category;
  }
}
