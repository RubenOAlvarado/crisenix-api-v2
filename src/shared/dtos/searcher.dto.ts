import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { Status } from '../enums/status.enum';
import { SearchableFields } from '../enums/searcher/destination/fields.enum';

export class SearcherDTO {
  @ApiProperty({
    description: 'field to search',
    example: SearchableFields.NAME,
    type: String,
    enum: SearchableFields,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
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

  constructor(field: SearchableFields, word: string) {
    this.field = field;
    this.word = word;
  }
}
