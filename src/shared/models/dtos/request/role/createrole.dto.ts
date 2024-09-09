import { IsRolePermissions } from '@/shared/decorators/IsRolePermissions.decorator';
import { Permissions } from '@/shared/enums/permissions.enum';
import { UserRoles } from '@/shared/enums/roles';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateRoleDTO {
  @ApiProperty({
    description: 'Description of the role.',
    enum: UserRoles,
    example: UserRoles.ADMIN,
  })
  @IsNotEmpty()
  @IsEnum(UserRoles)
  @IsString()
  description: UserRoles;

  @ApiProperty({
    enum: ['Activo', 'Inactivo'],
    description: 'Status of the role',
    example: 'Activo',
  })
  @IsNotEmpty()
  @IsString()
  status: string;

  @ApiProperty({
    description: 'Permissions of the role.',
    example: [Permissions.ACCESS_LOGS, Permissions.MANAGE_USERS],
    enum: Permissions,
    isArray: true,
  })
  @IsNotEmpty()
  @IsEnum(Permissions, { each: true })
  @IsRolePermissions({
    message: 'Some permissions are not valid for this role',
  })
  permissions: Permissions[];

  constructor(
    description: UserRoles,
    status: string,
    permissions: Permissions[],
  ) {
    this.description = description;
    this.status = status;
    this.permissions = permissions;
  }
}
