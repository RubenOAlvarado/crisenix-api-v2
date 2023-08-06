import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { Status } from 'src/shared/enums/status.enum';

export class CreateClasificationDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(150)
  description?: string;

  @ApiPropertyOptional({ enum: Status })
  @IsOptional()
  @IsString()
  status?: Status;
}
