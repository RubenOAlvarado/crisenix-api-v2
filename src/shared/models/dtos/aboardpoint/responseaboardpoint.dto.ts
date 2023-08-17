import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ResponseAboardPointDTO {
  constructor(name: string, status: string, createdAt?: Date, _id?: string) {
    this.name = name;
    this.status = status;
    this.createdAt = createdAt;
    this._id = _id;
  }

  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: String })
  status: string;

  @ApiPropertyOptional({ type: Date, default: Date.now() })
  createdAt?: Date;

  @ApiPropertyOptional({ type: String })
  _id?: string;
}
