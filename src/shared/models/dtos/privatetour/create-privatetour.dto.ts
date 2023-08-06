import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsInt,
  IsMobilePhone,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreatePrivatetourDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(250)
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsMobilePhone()
  phone: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(300)
  destination: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(300)
  origin: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  initDate: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  returnDate: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  adults: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  children?: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(1000)
  tourDescription: string;
}
