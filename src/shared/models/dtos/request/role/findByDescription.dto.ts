import { UserRoles } from '@/shared/enums/roles';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class DescriptionDTO {
  @ApiProperty({
    description: 'Description of the role.',
    enum: UserRoles,
    example: UserRoles.ADMIN,
  })
  @IsNotEmpty()
  @IsEnum(UserRoles)
  @IsString()
  description: string;

  constructor(description: string) {
    this.description = description;
  }
}
