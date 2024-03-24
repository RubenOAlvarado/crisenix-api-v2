import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CoordinatorDTO {
  @ApiProperty({
    description: 'Transport',
    example: 'Bus',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(80)
  transport: string;

  @ApiProperty({
    description: 'Coordinator name',
    example: 'Juan Perez',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(150)
  name: string;

  @ApiProperty({
    description: 'Coordinator phone number',
    example: '9999999999',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  phone: string;

  constructor(transport: string, name: string, phone: string) {
    this.transport = transport;
    this.name = name;
    this.phone = phone;
  }
}
