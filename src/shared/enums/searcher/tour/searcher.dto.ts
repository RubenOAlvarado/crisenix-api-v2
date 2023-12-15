import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SearchableTourFields } from './fields.enum';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { TourStatus } from '../../tour/status.enum';
import { Transform } from 'class-transformer';
import { BooleanString } from '../../boolean-string.type';
import { SortTourFields } from './sortFields.enum';

export class SearcherTourDTO {
  @ApiProperty({
    description: 'field to search',
    example: SearchableTourFields.NAME,
    type: String,
    enum: SearchableTourFields,
  })
  @IsEnum(SearchableTourFields)
  @IsNotEmpty()
  field: SearchableTourFields;

  @ApiProperty({
    description:
      'value to search, it could be anything that we want to type in the front',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  word: string;

  @ApiPropertyOptional({
    description: 'Tour status to search.',
    enum: TourStatus,
    default: TourStatus.ACTIVE,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  status?: TourStatus;

  @ApiPropertyOptional({
    description: 'Inidicator if we want to populate catalogs for destination.',
    default: false,
  })
  @IsOptional()
  @IsEnum(BooleanString, {
    message: `The populate value must be either 'true' or 'false'`,
  })
  @Transform(({ value }) => value === 'true', { toPlainOnly: true })
  populate?: boolean;

  @ApiPropertyOptional({
    description: 'SortField to sort the results.',
    enum: SortTourFields,
    default: SortTourFields.NAME,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsEnum(SortTourFields)
  sort?: SortTourFields;

  constructor(field: SearchableTourFields, word: string) {
    this.field = field;
    this.word = word;
  }
}
