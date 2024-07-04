import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRoleDTO {
  @ApiProperty({
    description: 'Description of the role',
    example: 'admin',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    enum: ['Activo', 'Inactivo'],
    description: 'Status of the role',
    example: 'Activo',
  })
  @IsNotEmpty()
  @IsString()
  status: string;

  constructor(description: string, status: string) {
    this.description = description;
    this.status = status;
  }
}
