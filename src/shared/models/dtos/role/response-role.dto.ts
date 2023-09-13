import { ApiProperty } from '@nestjs/swagger';

export class ResponseRoleDTO {
  @ApiProperty()
  description: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  permissions: any;

  constructor(description: string, status: string, permissions: any) {
    this.description = description;
    this.status = status;
    this.permissions = permissions;
  }
}
