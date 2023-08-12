import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Status } from 'src/shared/enums/status.enum';

export class CreateCategoryDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  label: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @MaxLength(150)
  main?: string;

  @ApiProperty({ enum: Status })
  @IsOptional()
  @IsString()
  status?: Status;

  constructor(label: string) {
    this.label = label;
  }
}
