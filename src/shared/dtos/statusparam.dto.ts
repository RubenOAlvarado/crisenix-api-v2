import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class StatusDTO {
  @ApiPropertyOptional({
    description: 'Status to look for',
    example: 'Activo',
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  status?: string;
}
