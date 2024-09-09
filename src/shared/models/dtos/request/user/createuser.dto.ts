import {
  IsDateString,
  IsEnum,
  IsMobilePhone,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Status } from 'src/shared/enums/status.enum';

export class CreateUserDTO {
  @ApiPropertyOptional({
    description: 'Firebase uid of the user (if not sended, it will be created)',
    example: '1234567890',
    type: String,
  })
  @IsOptional()
  @IsString()
  firebaseUid?: string;

  @ApiProperty({
    description: 'Name of the user',
    example: 'John',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  name: string;

  @ApiProperty({
    description: 'Last name of the user',
    example: 'Doe',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  lastName: string;

  @ApiPropertyOptional({
    description: 'Second last name of the user (mexican clients)',
    example: 'Smith',
    type: String,
  })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  secondLast?: string;

  @ApiPropertyOptional({
    description: 'User phone number',
    example: '1234567890',
    type: String,
  })
  @IsOptional()
  @IsMobilePhone()
  phone?: string;

  @ApiPropertyOptional({
    enum: Status,
    description: 'User status',
    example: Status.ACTIVE,
    type: String,
  })
  @IsOptional()
  @IsEnum(Status)
  status?: Status;

  @ApiPropertyOptional({
    description:
      'User inactivation date (soft delete) but it delete his firebase account',
    example: '2021-12-31T23:59:59.999Z',
  })
  @IsOptional()
  @IsDateString()
  deletedAt?: Date;

  @ApiPropertyOptional({
    description: 'User role id',
    example: '1234567890',
    type: String,
  })
  @IsOptional()
  @IsMongoId()
  role: string;

  constructor(
    name: string,
    lastName: string,
    role: string,
    firebaseUid?: string,
  ) {
    this.firebaseUid = firebaseUid;
    this.name = name;
    this.lastName = lastName;
    this.role = role;
  }
}
