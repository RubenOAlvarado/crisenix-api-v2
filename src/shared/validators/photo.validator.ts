import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class PhotoValidator {
  @ApiProperty({ description: 'url from the photo to delete' })
  @IsNotEmpty()
  @IsString()
  @IsUrl()
  photo: string;

  @ApiProperty({ description: 'destination id' })
  @IsNotEmpty()
  @IsString()
  @IsMongoId({ message: 'It must be an id' })
  destination: string;

  constructor(photo: string, destination: string) {
    this.photo = photo;
    this.destination = destination;
  }
}
