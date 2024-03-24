import { ApiProperty } from '@nestjs/swagger';
import {
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { Status } from 'src/shared/enums/status.enum';

export class CreateTransportsDTO {
  @ApiProperty({
    description: 'Name of the transport.',
    example: 'Bus',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  name: string;

  @ApiProperty({
    description: 'Translation type of the transport.',
  })
  @IsNotEmpty()
  @IsMongoId()
  translationType: string;

  @ApiProperty({
    enum: Status,
    description: 'Status of the transport.',
    example: Status.ACTIVE,
  })
  @IsOptional()
  @IsString()
  status?: Status;

  constructor(name: string, translationType: string) {
    this.name = name;
    this.translationType = translationType;
  }
}
