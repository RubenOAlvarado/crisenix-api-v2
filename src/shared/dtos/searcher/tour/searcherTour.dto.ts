import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SearchableTourFields } from '../../../enums/searcher/tour/fields.enum';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateIf,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { BooleanString } from '../../../enums/boolean-string.type';
import { SortTourFields } from '../../../enums/searcher/tour/sortFields.enum';
import { IsInitDate } from '@/shared/decorators/isValidInitDate.decorator';

export class SearcherTourDTO {
  @ApiPropertyOptional({
    description: 'field to search',
    example: SearchableTourFields.NAME,
    enum: SearchableTourFields,
  })
  @IsOptional()
  @IsEnum(SearchableTourFields)
  @IsNotEmpty()
  @IsString()
  field: SearchableTourFields;

  @ApiProperty({
    description:
      'value to search, it could be anything that we want to type in the front',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  @ValidateIf((o) => o.field && o.field === SearchableTourFields.INITDATE)
  @IsInitDate()
  word: string;

  @ApiPropertyOptional({
    description: 'Indicator if we want to populate catalogs for tour.',
    default: false,
  })
  @IsOptional()
  @IsEnum(BooleanString, {
    message: `The populate value must be either 'true' or 'false'`,
  })
  @Transform(({ value }) => value === 'true', { toPlainOnly: true })
  populate: boolean;

  @ApiPropertyOptional({
    description: 'SortField to sort the results.',
    enum: SortTourFields,
    default: SortTourFields.NAME,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsEnum(SortTourFields)
  sort: SortTourFields;

  constructor(
    field: SearchableTourFields,
    word: string,
    populate: boolean,
    sort: SortTourFields,
  ) {
    this.field = field;
    this.word = word;
    this.populate = populate;
    this.sort = sort;
  }
}
