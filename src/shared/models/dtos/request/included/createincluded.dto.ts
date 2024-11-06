import { IsMongoId, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateIncludedServiceDTO {
  @ApiProperty({
    description: 'Service concept',
    example: 'Desayuno completo',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(250)
  concept: string;

  @ApiProperty({
    description: 'Entry (kind of included service)',
    example: '60a7e9b1e9d1f0c6e0f6e6f2',
  })
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  entry: string;

  constructor(concept: string, entry: string) {
    this.concept = concept;
    this.entry = entry;
  }
}
