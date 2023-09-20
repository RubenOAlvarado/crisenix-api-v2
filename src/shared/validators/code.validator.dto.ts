import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CodeValidator {
  @ApiProperty({
    description: 'Destination code to look',
    example: 'HAN',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(15)
  code: string;

  constructor(code: string) {
    this.code = code;
  }
}
