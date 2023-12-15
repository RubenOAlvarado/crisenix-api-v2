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
    description: 'field to search',
    example: SearchableFields.NAME,
    type: String,
    enum: SearchableFields,
  })
  @IsEnum(SearchableFields)
  @IsNotEmpty()
  @IsString()
  field: SearchableFields;

  @ApiProperty({
    description:
      'value to search, it could be anything that we want to type in the front',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  word: string;

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
    default: SortFields.NAME,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsEnum(SortFields)
  sort?: SortFields;

  constructor(field: SearchableFields, word: string) {
    this.field = field;
    this.word = word;
  }
}
