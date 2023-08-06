import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Status } from '../enums/status.enum';

export class SearcherDTO {
  @ApiProperty({
    description:
      'value to search, it could be anything that we want tou type in the front',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  word: string;

  @ApiProperty({ description: 'status of the table', enum: Status })
  @IsNotEmpty()
  @IsString()
  status: Status;
}
