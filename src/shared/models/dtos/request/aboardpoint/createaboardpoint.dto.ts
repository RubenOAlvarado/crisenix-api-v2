import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreateAboardPointDTO {
  @ApiProperty({
    type: String,
    required: true,
    description: 'Name of the aboard point',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Origin city of the aboard point',
  })
  @IsMongoId()
  @IsNotEmpty()
  originCity!: string;
}
