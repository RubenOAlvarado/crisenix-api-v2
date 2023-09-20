import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsString } from 'class-validator';

export class UrlValidator {
  @ApiProperty({
    description: 'The id of the item to look for (it is mongo id).',
    example: '5f9d7a3b9d3e9e1b7c9b4b1c',
  })
  @IsString()
  @IsMongoId()
  id: string;

  constructor(id: string) {
    this.id = id;
  }
}
