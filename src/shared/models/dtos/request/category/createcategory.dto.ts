import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Status } from 'src/shared/enums/status.enum';

export class CreateCategoryDTO {
  @ApiProperty({
    description: 'Category label (name)',
    example: 'Internacionales',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  label: string;

  @ApiProperty({
    enum: Status,
    default: Status.ACTIVE,
    example: Status.ACTIVE,
    description: 'Category status',
  })
  @IsOptional()
  @IsString()
  status?: Status;

  constructor(label: string) {
    this.label = label;
  }
}
