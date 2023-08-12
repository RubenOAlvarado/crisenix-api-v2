import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class NameValidator {
  @ApiProperty({
    description: 'Destination name to look',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(80)
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}
