import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsMobilePhone,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';
export class UpdateWebUserDTO {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  lastName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(150)
  secondLast?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsMobilePhone()
  phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsMongoId()
  role?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(150)
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsPhoneNumber()
  phoneNumber?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  displayName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  photoUrl?: string;
}
