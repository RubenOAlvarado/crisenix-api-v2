import { ApiProperty } from '@nestjs/swagger';
import {
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { Status } from 'src/shared/enums/status.enum';

export class CreateTransportsDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsMongoId()
  translationType: string;

  @ApiProperty({ enum: Status })
  @IsOptional()
  @IsString()
  status?: Status;

  constructor(name: string, translationType: string) {
    this.name = name;
    this.translationType = translationType;
  }
}
