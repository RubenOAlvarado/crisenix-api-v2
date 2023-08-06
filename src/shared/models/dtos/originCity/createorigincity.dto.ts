import {
  ArrayNotEmpty,
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Status } from 'src/shared/enums/status.enum';

export class CreateOriginCityDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  state: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @ArrayNotEmpty()
  @IsArray()
  @IsMongoId({ each: true })
  aboardPoints?: Array<string>;

  @ApiProperty({ enum: Status })
  @IsOptional()
  @IsString()
  status?: Status;
}
