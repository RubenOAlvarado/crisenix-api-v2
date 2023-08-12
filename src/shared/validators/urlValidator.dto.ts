import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsString } from 'class-validator';

export class UrlValidator {
  @ApiProperty()
  @IsString()
  @IsMongoId()
  id: string;

  constructor(id: string) {
    this.id = id;
  }
}
