import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { Status } from '../../status.enum';
import { SearchableFields } from './fields.enum';
import { BooleanString } from '../../boolean-string.type';
import { Transform } from 'class-transformer';
import { SortFields } from './sortFields.enum';

export class SearcherDTO {
  @ApiProperty({
    description:
      'value to search, it could be anything that we want to type in the front',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  word: string;

  @ApiPropertyOptional({
    description: 'Field to search',
    example: SearchableFields.NAME,
    enum: SearchableFields,
  })
  @IsOptional()
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
    description: 'Inidicator if we want to load sub catalogs for destination.',
    default: false,
  })
  @IsOptional()
  @IsEnum(BooleanString, {
    message: `The subCatalog value must be either 'true' or 'false'`,
  })
  @Transform(({ value }) => value === 'true', { toPlainOnly: true })
  subCatalog?: boolean;

  @ApiPropertyOptional({
    description: 'SortField to sort the results.',
    enum: SortFields,
    default: SortFields.CREATED,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsEnum(SortFields)
  sort?: SortFields;

  constructor(word: string) {
    this.word = word;
  }
}
