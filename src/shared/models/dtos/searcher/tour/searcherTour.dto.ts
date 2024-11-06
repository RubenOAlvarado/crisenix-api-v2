import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateIf,
} from 'class-validator';
import { IsInitDate } from '@/shared/decorators/isValidInitDate.decorator';
import { TourStatus } from '@/shared/enums/tour/status.enum';
import { SearchableTourFields } from '@/shared/enums/searcher/tour/fields.enum';
import { SortTourFields } from '@/shared/enums/searcher/tour/sortFields.enum';
import { TourQueryDTO } from './tourQuery.dto';

export class SearcherTourDTO extends TourQueryDTO {
  @ApiPropertyOptional({
    description: 'field to search',
    example: SearchableTourFields.NAME,
    enum: SearchableTourFields,
  })
  @IsOptional()
  @IsEnum(SearchableTourFields)
  @IsNotEmpty()
  @IsString()
  field!: SearchableTourFields;

  @ApiProperty({
    description:
      'value to search, it could be anything that we want to type in the front',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  @ValidateIf((o) => o.field && o.field === SearchableTourFields.INITDATE)
  @IsInitDate()
  word!: string;

  @ApiPropertyOptional({
    description: 'SortField to sort the results.',
    enum: SortTourFields,
    default: SortTourFields.NAME,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsEnum(SortTourFields)
  sort!: SortTourFields;

  @ApiPropertyOptional({
    default: TourStatus.ACTIVE,
    description: 'Status to look for (optional)',
    enum: TourStatus,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsEnum(TourStatus)
  status?: TourStatus;
}
