import { QueryDTO } from '@/shared/models/dtos/searcher/query.dto';
import { SearchableFields } from '@/shared/enums/searcher/destination/fields.enum';
import { SortFields } from '@/shared/enums/searcher/destination/sortFields.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class SearcherDestinationDto extends QueryDTO {
  @ApiProperty({
    description:
      'value to search, it could be anything that we want to type in the front',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  word!: string;

  @ApiProperty({
    description: 'Field to search',
    example: SearchableFields.NAME,
    enum: SearchableFields,
    default: SearchableFields.NAME,
  })
  @IsEnum(SearchableFields)
  @IsNotEmpty()
  @IsString()
  field!: SearchableFields;

  @ApiProperty({
    description: 'SortField to sort the results.',
    enum: SortFields,
    default: SortFields.CREATED,
  })
  @IsNotEmpty()
  @IsEnum(SortFields)
  sort!: SortFields;
}
