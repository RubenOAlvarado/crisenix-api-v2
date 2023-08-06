import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Status } from 'src/shared/enums/status.enum';

export class CreateCatalogDTO {
  @ApiPropertyOptional()
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  name?: string;

  @ApiPropertyOptional()
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  description?: string;

  @ApiPropertyOptional({ enum: Status })
  @IsOptional()
  @IsString()
  status?: Status;
}
