import { Entry } from '@/shared/enums/entry.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class CreateEntryDTO {
  @ApiProperty({
    description: 'Entry description',
    example: 'Alimentos',
    enum: Entry,
  })
  @IsNotEmpty()
  @IsEnum(Entry)
  description: Entry;

  constructor(description: Entry) {
    this.description = description;
  }
}
