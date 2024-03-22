import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ResponseRoleDTO } from '../role/response-role.dto';

export class ResponseWebUserDTO {
  @ApiPropertyOptional()
  emailVerified?: boolean;

  @ApiPropertyOptional()
  phoneNumber?: string;

  @ApiPropertyOptional()
  displayName?: string;

  @ApiPropertyOptional()
  photoUrl?: string;

  @ApiPropertyOptional()
  disabled?: boolean;

  @ApiProperty()
  email?: string;

  @ApiProperty()
  firebaseUid: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  lastName: string;

  @ApiPropertyOptional()
  secondLast?: string;

  @ApiPropertyOptional()
  phone?: string;

  @ApiProperty()
  role: ResponseRoleDTO;

  constructor(
    firebaseUid: string,
    name: string,
    lastName: string,
    role: ResponseRoleDTO,
    emailVerified?: boolean,
    phoneNumber?: string,
    photoUrl?: string,
    disabled?: boolean,
    secondLast?: string,
    phone?: string,
    displayName?: string,
    email?: string,
  ) {
    this.displayName = displayName;
    this.firebaseUid = firebaseUid;
    this.name = name;
    this.lastName = lastName;
    this.role = role;
    this.emailVerified = emailVerified;
    this.phoneNumber = phoneNumber;
    this.photoUrl = photoUrl;
    this.disabled = disabled;
    this.secondLast = secondLast;
    this.phone = phone;
    this.email = email;
  }
}
