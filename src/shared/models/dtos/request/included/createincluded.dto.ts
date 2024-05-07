import {
  IsNotEmpty,
  IsNotEmptyObject,
  IsOptional,
  IsString,
  MaxLength,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Entry } from 'src/shared/enums/entry.enum';
import { CreateLodgingDTO } from './createLodging.dto';

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
    description: 'Service lodging, if entry is Hospedaje',
  })
  @ValidateIf((o) => o.entry === Entry.HOSPEDAJE)
  @IsOptional()
  @IsNotEmptyObject()
  @ValidateNested()
  lodging?: CreateLodgingDTO;

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
