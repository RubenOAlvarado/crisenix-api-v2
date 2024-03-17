import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SearchableTourFields } from './fields.enum';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateIf,
} from 'class-validator';
import { TourStatus } from '../../tour/status.enum';
import { Transform } from 'class-transformer';
import { BooleanString } from '../../boolean-string.type';
import { SortTourFields } from './sortFields.enum';
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
  field?: SearchableTourFields;

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
    description: 'Tour status to search.',
    enum: TourStatus,
    default: TourStatus.ACTIVE,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  status?: TourStatus;

  @ApiPropertyOptional({
    description: 'Indicator if we want to populate catalogs for tour.',
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

  constructor(word: string) {
    this.word = word;
  }
}
