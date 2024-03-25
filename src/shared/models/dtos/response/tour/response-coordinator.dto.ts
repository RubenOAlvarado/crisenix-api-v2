import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ResponseCoordinatorDto {
  @ApiProperty()
  @Expose()
  transport: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  phone: string;

  constructor(transport: string, name: string, phone: string) {
    this.transport = transport;
    this.name = name;
    this.phone = phone;
  }
}
