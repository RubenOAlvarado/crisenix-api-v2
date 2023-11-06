import { ApiProperty } from '@nestjs/swagger';

export class ResponseCoordinatorDto {
  @ApiProperty({
    description: 'Transport',
    example: 'Bus',
  })
  transport: string;

  @ApiProperty({
    description: 'Coordinator name',
    example: 'Juan Perez',
  })
  name: string;

  @ApiProperty({
    description: 'Coordinator phone number',
    example: '9999999999',
  })
  phone: string;

  constructor(transport: string, name: string, phone: string) {
    this.transport = transport;
    this.name = name;
    this.phone = phone;
  }
}
