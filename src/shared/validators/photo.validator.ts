import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsString, IsUrl } from 'class-validator';

export class PhotoValidator {
  @ApiProperty({
    description: 'Photos to be deleted',
    example: ['https://www.example.com/photo.jpg'],
    isArray: true,
    type: String,
  })
  @IsArray()
  @ArrayNotEmpty({ message: 'Photos should not be empty' })
  @IsString({ each: true })
  @IsUrl({ require_protocol: true }, { each: true })
  photos: string[];

  constructor(photos: string[]) {
    this.photos = photos;
  }
}
