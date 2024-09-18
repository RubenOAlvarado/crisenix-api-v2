import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsMongoId, IsNotEmpty } from 'class-validator';

export class CreateTourIncludedDTO {
  @ApiProperty({
    description: 'Included service',
    example: '60a7e9b1e9d1f0c6e0f6e6f2',
  })
  @IsNotEmpty()
  @IsMongoId()
  included: string;

  @ApiProperty({
    description: 'Publish service in this tour?',
    example: 'No',
    enum: ['Sí', 'No'],
  })
  @IsNotEmpty()
  @IsEnum(['Sí', 'No'])
  published: string;

  constructor(included: string, published: string) {
    this.included = included;
    this.published = published;
  }
}
