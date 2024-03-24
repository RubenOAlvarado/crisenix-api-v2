import { ApiProperty } from '@nestjs/swagger';

export class ResponseAboardPointDTO {
  constructor(name: string, status: string) {
    this.name = name;
    this.status = status;
  }

  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: String })
  status: string;
}
