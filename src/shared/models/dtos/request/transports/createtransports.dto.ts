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
    description: 'Transfer type for the transport.',
  })
  @IsNotEmpty()
  @IsMongoId()
  transferType: string;

  @ApiProperty({
    enum: Status,
    description: 'Status of the transport.',
    example: Status.ACTIVE,
  })
  @IsOptional()
  @IsString()
  status?: Status;

  constructor(name: string, transferType: string) {
    this.name = name;
    this.transferType = transferType;
  }
}
