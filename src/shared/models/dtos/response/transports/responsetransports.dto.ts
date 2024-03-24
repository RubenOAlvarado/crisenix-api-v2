import { ApiProperty } from '@nestjs/swagger';
import { ResponseTranslationTypeDTO } from '../translationType/responseTranslationType.dto';

export class ResponseTransportsDTO {
  @ApiProperty({
    description: 'Transport name',
    type: String,
  })
  name: string;

  @ApiProperty({
    description: 'Transport translation type',
    type: ResponseTranslationTypeDTO,
  })
  translationType: ResponseTranslationTypeDTO;

  constructor(name: string, translationType: ResponseTranslationTypeDTO) {
    this.name = name;
    this.translationType = translationType;
  }
}
