import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsMongoId, IsOptional, IsString } from 'class-validator';

export class SearchLogDTO {
  @ApiProperty()
  @IsOptional()
  @IsMongoId()
  serviceId?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  service?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  move?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  user?: string;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  date?: Date;
}
