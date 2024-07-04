import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Entry } from 'src/shared/enums/entry.enum';

export class CreateIncludedDTO {
  @ApiProperty({
    description: 'Service concept',
    example: 'Desayuno completo',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(250)
  concept: string;

  @ApiProperty({
    description: 'Included indicator',
    example: 'SI',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(2)
  included: string;

  @ApiProperty({
    description: 'Publish indicator',
    example: 'SI',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(2)
  publish: string;

  @ApiProperty({
    description: 'Entry indicator',
    example: Entry.ALIMENTOS,
    enum: Entry,
  })
  @IsNotEmpty()
  @IsString()
  entry: Entry;

  constructor(
    concept: string,
    included: string,
    publish: string,
    entry: Entry,
  ) {
    this.concept = concept;
    this.included = included;
    this.publish = publish;
    this.entry = entry;
  }
}
