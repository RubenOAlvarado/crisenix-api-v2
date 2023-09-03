import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsString } from 'class-validator';

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

  @ApiPropertyOptional({
    description: 'Permissions of the role by section.',
    example: {
      users: ['create', 'read', 'update', 'delete'],
      catalogs: ['create', 'read', 'update', 'delete'],
    },
  })
  @IsObject()
  permissions?: any;

  constructor(description: string, status: string, permissions?: any) {
    this.description = description;
    this.status = status;
    this.permissions = permissions;
  }
}
