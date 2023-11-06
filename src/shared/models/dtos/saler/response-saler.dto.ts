import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ResponseSalerDto {
  @ApiProperty({
    description: 'Saler code',
    example: 'S-0001',
  })
  code: string;

  @ApiProperty({
    description: 'Saler name',
    example: 'Juan',
  })
  name: string;

  @ApiProperty({
    description: 'Saler last name',
    example: 'Perez',
  })
  lastName: string;

  @ApiPropertyOptional({
    description: 'Saler second last name',
    example: 'Gomez',
  })
  secondLastName?: string;

  @ApiProperty({
    description: 'Saler type',
    example: 'App',
  })
  salerType: string;

  @ApiProperty({
    description: 'Saler status',
    example: 'Active',
  })
  status: string;

  constructor(
    code: string,
    name: string,
    lastName: string,
    salerType: string,
    status: string,
  ) {
    this.code = code;
    this.name = name;
    this.lastName = lastName;
    this.salerType = salerType;
    this.status = status;
  }
}
