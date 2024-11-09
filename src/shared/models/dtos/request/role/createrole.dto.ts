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
  @IsNotEmpty({ message: 'Description is required' })
  @IsEnum(UserRoles, { message: 'Invalid role description' })
  @IsString()
  description: UserRoles;

  @ApiProperty({
    description: 'Permissions of the role.',
    example: [Permissions.ACCESS_LOGS, Permissions.MANAGE_USERS],
    enum: Permissions,
    isArray: true,
  })
  @IsNotEmpty({ message: 'Permissions are required' })
  @IsEnum(Permissions, { each: true })
  @IsRolePermissions({
    message: 'Some permissions are not valid for this role',
  })
  permissions: Permissions[];

  constructor(description: UserRoles, permissions: Permissions[]) {
    this.description = description;
    this.permissions = permissions;
  }
}
