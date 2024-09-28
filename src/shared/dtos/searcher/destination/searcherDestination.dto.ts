import { SearchableFields } from '@/shared/enums/searcher/destination/fields.enum';
import { SortFields } from '@/shared/enums/searcher/destination/sortFields.enum';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsBooleanString,
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';

export class SearcherDestinationDto {
  @ApiProperty({
    description:
      'value to search, it could be anything that we want to type in the front',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  word: string;

  @ApiProperty({
    description: 'Field to search',
    example: SearchableFields.NAME,
    enum: SearchableFields,
    default: SearchableFields.NAME,
  })
  @IsEnum(SearchableFields)
  @IsNotEmpty()
  @IsString()
  field: SearchableFields;

  @ApiProperty({
    description: 'Indicator if we want to load sub catalogs for destination.',
    default: false,
  })
  @IsNotEmpty()
  @IsBooleanString()
  subCatalog: boolean;

  @ApiProperty({
    description: 'SortField to sort the results.',
    enum: SortFields,
    default: SortFields.CREATED,
  })
  @IsNotEmpty()
  @IsEnum(SortFields)
  sort: SortFields;

  constructor(
    word: string,
    field: SearchableFields,
    subCatalog: boolean,
    sort: SortFields,
  ) {
    this.word = word;
    this.field = field;
    this.subCatalog = subCatalog;
    this.sort = sort;
  }
}
