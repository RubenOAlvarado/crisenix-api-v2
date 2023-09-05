import {
  IsBoolean,
  IsDateString,
  IsMobilePhone,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Status } from 'src/shared/enums/status.enum';

export class CreateUserDTO {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  firebaseUid?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  fbregistered: boolean;

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

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(150)
  secondLast?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsMobilePhone()
  phone?: string;

  @ApiPropertyOptional({ enum: Status })
  @IsOptional()
  status?: Status;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  deletedAt?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsMongoId()
  role?: string;

  constructor(
    name: string,
    lastName: string,
    fbregistered: boolean,
    firebaseUid?: string,
  ) {
    this.firebaseUid = firebaseUid;
    this.name = name;
    this.lastName = lastName;
    this.fbregistered = fbregistered;
  }
}
