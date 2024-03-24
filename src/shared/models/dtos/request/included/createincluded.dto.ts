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
  @ApiProperty({
    description: 'Service concept',
    example: 'Desayno completo',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(250)
  concept: string;

  @ApiProperty({
    description: 'Included indicator',
    example: 'SI',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(2)
  included: string;

  @ApiProperty({
    description: 'Publish indicator',
    example: 'SI',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(2)
  publish: string;

  @ApiProperty({
    description: 'Entry indicator',
    example: Entry.HOSPEDAJE,
    enum: Entry,
  })
  @IsNotEmpty()
  @IsString()
  entry: Entry;

  @ApiPropertyOptional({
    description: `City name, if entry is ${Entry.HOSPEDAJE}`,
    example: 'Ciudad de México',
  })
  @ValidateIf((o) => o.entry === Entry.HOSPEDAJE)
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  city?: string;

  @ApiPropertyOptional({
    description: `Hotel name, if entry is ${Entry.HOSPEDAJE}`,
    example: 'Fiesta Inn',
  })
  @ValidateIf((o) => o.entry === Entry.HOSPEDAJE)
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  hotel?: string;

  @ApiPropertyOptional({
    enum: HotelStatus,
    description: `Hotel status, if entry is ${Entry.HOSPEDAJE}`,
    example: HotelStatus.TENTATIVO,
  })
  @ValidateIf((o) => o.entry === Entry.HOSPEDAJE)
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MaxLength(15)
  hotelStatus?: HotelStatus;

  @ApiPropertyOptional({
    description: `Hotel address, if entry is ${Entry.HOSPEDAJE}`,
    example: 'Av. Insurgentes Sur 553, Roma Sur, 06760 Cuauhtémoc, CDMX',
  })
  @ValidateIf((o) => o.entry === Entry.HOSPEDAJE)
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  address?: string;

  @ApiPropertyOptional({
    description: `Hotel phone, if entry is ${Entry.HOSPEDAJE}`,
    example: '55 5140 2300',
  })
  @ValidateIf((o) => o.entry === Entry.HOSPEDAJE)
  @IsOptional()
  @IsNotEmpty()
  @IsPhoneNumber()
  @MaxLength(15)
  phone?: string;

  @ApiPropertyOptional({
    description: `Reserved nights, if entry is ${Entry.HOSPEDAJE}`,
    example: 2,
  })
  @ValidateIf((o) => o.entry === Entry.HOSPEDAJE)
  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  nights?: number;

  @ApiPropertyOptional({
    description: `Check in date, if entry is ${Entry.HOSPEDAJE}`,
    example: '2020-10-30T05:00:00.000Z',
  })
  @ValidateIf((o) => o.entry === Entry.HOSPEDAJE)
  @IsOptional()
  @IsNotEmpty()
  @IsDateString()
  checkIn?: Date;

  @ApiPropertyOptional({
    description: `Check out date, if entry is ${Entry.HOSPEDAJE}`,
    example: '2020-10-30T05:00:00.000Z',
  })
  @ValidateIf((o) => o.entry === Entry.HOSPEDAJE)
  @IsOptional()
  @IsNotEmpty()
  @IsDateString()
  checkOut?: Date;

  @ApiPropertyOptional({
    description: `Single room price, if entry is ${Entry.HOSPEDAJE}`,
    example: 2000,
  })
  @ValidateIf((o) => o.entry === Entry.HOSPEDAJE)
  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  @MaxLength(6)
  single?: number;

  @ApiPropertyOptional({
    description: `Single base room price, if entry is ${Entry.HOSPEDAJE}`,
    example: 2000,
  })
  @ValidateIf((o) => o.entry === Entry.HOSPEDAJE)
  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  @MaxLength(6)
  singleBase?: number;

  @ApiPropertyOptional({
    description: `Double base room price, if entry is ${Entry.HOSPEDAJE}`,
    example: 2000,
  })
  @ValidateIf((o) => o.entry === Entry.HOSPEDAJE)
  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  @MaxLength(6)
  doubleBase?: number;

  @ApiPropertyOptional({
    description: `Triple base room price, if entry is ${Entry.HOSPEDAJE}`,
    example: 2000,
  })
  @ValidateIf((o) => o.entry === Entry.HOSPEDAJE)
  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  @MaxLength(6)
  tripleBase?: number;

  @ApiPropertyOptional({
    description: `Quadruple base room price, if entry is ${Entry.HOSPEDAJE}`,
    example: 2000,
  })
  @ValidateIf((o) => o.entry === Entry.HOSPEDAJE)
  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  @MaxLength(6)
  quadrupleBase?: number;

  @ApiPropertyOptional({
    description: `Minor room price (childs), if entry is ${Entry.HOSPEDAJE}`,
    example: 2000,
  })
  @ValidateIf((o) => o.entry === Entry.HOSPEDAJE)
  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  @MaxLength(6)
  minor?: number;

  @ApiPropertyOptional({
    description: `Inpam room price (adults + 60 years old), if entry is ${Entry.HOSPEDAJE}`,
    example: 2000,
  })
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
