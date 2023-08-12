import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Status } from 'src/shared/enums/status.enum';

export class CreateCatalogDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  description: string;

  @ApiPropertyOptional({ enum: Status })
  @IsOptional()
  @IsString()
  status?: Status;

  constructor(name: string, description: string) {
    this.name = name;
    this.description = description;
  }
}
