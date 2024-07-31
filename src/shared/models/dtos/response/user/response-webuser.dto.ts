import { ResponseRoleDTO } from '../role/response-role.dto';
import { Expose, Type } from 'class-transformer';
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { ObjectIdToString } from '@/shared/decorators/objectIdTransformer.transformer';

export class ResponseWebUserDTO {
  @ApiPropertyOptional()
  @Expose()
  @ObjectIdToString()
  _id?: string;

  @ApiPropertyOptional()
  @Expose()
  emailVerified?: boolean;

  @ApiPropertyOptional()
  @Expose()
  phoneNumber?: string;

  @ApiPropertyOptional()
  @Expose()
  displayName?: string;

  @ApiPropertyOptional()
  @Expose()
  photoUrl?: string;

  @ApiPropertyOptional()
  @Expose()
  disabled?: boolean;

  @ApiPropertyOptional()
  @Expose()
  email?: string;

  @ApiProperty()
  @Expose()
  firebaseUid: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  lastName: string;

  @ApiPropertyOptional()
  @Expose()
  secondLast?: string;

  @ApiPropertyOptional()
  @Expose()
  phone?: string;

  @ApiProperty()
  @Type(() => ResponseRoleDTO)
  @Expose()
  role: ResponseRoleDTO | string;

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
