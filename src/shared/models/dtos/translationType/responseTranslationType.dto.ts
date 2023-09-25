import { ApiProperty } from '@nestjs/swagger';

export class ResponseTranslationTypeDTO {
  @ApiProperty({
    description: 'Translation type name',
  })
  name: string;

  @ApiProperty({
    description: 'Translation type status',
  })
  status: string;

  constructor(name: string, status: string) {
    this.name = name;
    this.status = status;
  }
}
