import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SignInDto {
  constructor(user: string, password: string) {
    this.user = user;
    this.password = password;
  }

  @ApiProperty({
    description: 'User',
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  user: string;

  @ApiProperty({
    description: 'Password',
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
