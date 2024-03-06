import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Status } from '../enums/status.enum';

export class StatusDTO {
  @ApiPropertyOptional({
    description: 'Status to look for',
    example: 'Activo',
    enum: Status,
  })
  @IsOptional()
  @IsEnum(Status)
  @IsNotEmpty()
  @IsString()
  status?: Status;
}
