import {
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Status } from 'src/shared/enums/status.enum';

export class CreateSalerDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(5)
  code: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  lastName: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @MaxLength(150)
  secondLastName?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsMongoId()
  salerType: string;

  @ApiProperty({ enum: Status })
  @IsOptional()
  @IsString()
  status?: Status;

  constructor(code: string, name: string, lastName: string, salerType: string) {
    this.code = code;
    this.name = name;
    this.lastName = lastName;
    this.salerType = salerType;
  }
}
