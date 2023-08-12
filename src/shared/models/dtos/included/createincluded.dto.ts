import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
  Min,
  ValidateIf,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Entry } from 'src/shared/enums/entry.enum';
import { HotelStatus } from 'src/shared/enums/hotelstatus.enum';

export class CreateIncludedDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(250)
  concept: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(2)
  included: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(2)
  publish: string;

  @ApiProperty({ enum: Entry })
  @IsNotEmpty()
  @IsString()
  entry: Entry;

  @ApiPropertyOptional()
  @ValidateIf((o) => o.entry === Entry.HOSPEDAJE)
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  city?: string;

  @ApiPropertyOptional()
  @ValidateIf((o) => o.entry === Entry.HOSPEDAJE)
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  hotel?: string;

  @ApiPropertyOptional({ enum: HotelStatus })
  @ValidateIf((o) => o.entry === Entry.HOSPEDAJE)
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MaxLength(15)
  hotelStatus?: HotelStatus;

  @ApiPropertyOptional()
  @ValidateIf((o) => o.entry === Entry.HOSPEDAJE)
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  address?: string;

  @ApiPropertyOptional()
  @ValidateIf((o) => o.entry === Entry.HOSPEDAJE)
  @IsOptional()
  @IsNotEmpty()
  @IsPhoneNumber()
  @MaxLength(15)
  phone?: string;

  @ApiPropertyOptional()
  @ValidateIf((o) => o.entry === Entry.HOSPEDAJE)
  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  nights?: number;

  @ApiPropertyOptional()
  @ValidateIf((o) => o.entry === Entry.HOSPEDAJE)
  @IsOptional()
  @IsNotEmpty()
  @IsDateString()
  checkIn?: Date;

  @ApiPropertyOptional()
  @ValidateIf((o) => o.entry === Entry.HOSPEDAJE)
  @IsOptional()
  @IsNotEmpty()
  @IsDateString()
  checkOut?: Date;

  @ApiPropertyOptional()
  @ValidateIf((o) => o.entry === Entry.HOSPEDAJE)
  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  @MaxLength(6)
  single?: number;

  @ApiPropertyOptional()
  @ValidateIf((o) => o.entry === Entry.HOSPEDAJE)
  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  @MaxLength(6)
  singleBase?: number;

  @ApiPropertyOptional()
  @ValidateIf((o) => o.entry === Entry.HOSPEDAJE)
  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  @MaxLength(6)
  doubleBase?: number;

  @ApiPropertyOptional()
  @ValidateIf((o) => o.entry === Entry.HOSPEDAJE)
  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  @MaxLength(6)
  tripleBase?: number;

  @ApiPropertyOptional()
  @ValidateIf((o) => o.entry === Entry.HOSPEDAJE)
  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  @MaxLength(6)
  quadrupleBase?: number;

  @ApiPropertyOptional()
  @ValidateIf((o) => o.entry === Entry.HOSPEDAJE)
  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  @MaxLength(6)
  minor?: number;

  @ApiPropertyOptional()
  @ValidateIf((o) => o.entry === Entry.HOSPEDAJE)
  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  @MaxLength(6)
  inapam?: number;

  constructor(
    concept: string,
    included: string,
    publish: string,
    entry: Entry,
  ) {
    this.concept = concept;
    this.included = included;
    this.publish = publish;
    this.entry = entry;
  }
}
