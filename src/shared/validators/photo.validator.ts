import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class PhotoValidator {
  @ApiProperty({
    description: 'url from the photo to delete',
    example: 'https://www.google.com',
  })
  @IsNotEmpty()
  @IsString()
  @IsUrl()
  photo: string;

  @ApiProperty({
    description: 'Destination id that this photo belongs to.',
    example: '60f1b2b3e6b2f1b2b3e6b2f1',
  })
  @IsNotEmpty()
  @IsString()
  @IsMongoId({ message: 'It must be a mongo id' })
  destination: string;

  constructor(photo: string, destination: string) {
    this.photo = photo;
    this.destination = destination;
  }
}
