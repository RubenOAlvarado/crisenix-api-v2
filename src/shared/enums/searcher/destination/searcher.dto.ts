import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateIf,
} from 'class-validator';
import { Status } from '../../status.enum';
import { SearchableFields } from './fields.enum';
import { BooleanString } from '../../boolean-string.type';
import { Transform } from 'class-transformer';
import { SortFields } from './sortFields.enum';
import { SearchType } from '../search-type.enum';

export class SearcherDTO {
  @ApiProperty({
    description:
      'value to search, if searchType is EXACTMATCH will just return the exact match of the word',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  word: string;

  @ApiPropertyOptional({
    description: 'Field to search, if searchType is EXACTMATCH',
    example: SearchableFields.NAME,
    enum: SearchableFields,
  })
  @ValidateIf((o) => o.searchType && o.searchType === SearchType.EXACTMATCH)
  @IsEnum(SearchableFields)
  @IsNotEmpty()
  @IsString()
  field?: SearchableFields;

  @ApiPropertyOptional({
    description: 'status of the table',
    enum: Status,
    default: Status.ACTIVE,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  status?: Status;

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
    enum: SortFields,
    default: SortFields.CREATED,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsEnum(SortFields)
  sort?: SortFields;

  @ApiPropertyOptional({
    description: 'Kind of search indicator.',
    enum: SearchType,
    default: SearchType.EXACTMATCH,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsEnum(SearchType)
  searchType?: SearchType;

  constructor(word: string) {
    this.word = word;
  }
}
