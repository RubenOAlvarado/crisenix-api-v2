import {
  IsNotEmpty,
  IsEmail,
  IsBoolean,
  IsOptional,
  IsPhoneNumber,
  MaxLength,
  IsString,
  IsAlphanumeric,
  IsUrl,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateFbUserDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(150)
  email: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsBoolean()
  emailVerified?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsPhoneNumber(null)
  phoneNumber?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  password?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsAlphanumeric()
  @MaxLength(150)
  displayName: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  photoUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  disabled?: boolean;
}
