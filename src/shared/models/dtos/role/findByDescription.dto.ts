import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DescriptionDTO {
  @ApiProperty({
    description: 'Description of the role.',
    example: 'admin',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  constructor(description: string) {
    this.description = description;
  }
}
