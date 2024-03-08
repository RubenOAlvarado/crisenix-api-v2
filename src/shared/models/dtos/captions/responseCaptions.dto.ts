import { ApiProperty } from '@nestjs/swagger';

export class ResponseCaptionsDTO {
  @ApiProperty({
    description: 'Caption name',
    type: String,
    example: 'Caption 1',
  })
  name: string;

  @ApiProperty({
    description: 'Caption status',
    type: String,
    example: 'Active',
  })
  status: string;

  @ApiProperty({
    description: 'Caption created at',
    type: String,
    example: '2021-08-27T19:38:01.000Z',
  })
  createdAt: string;

  constructor(name: string, status: string, createdAt: string) {
    this.name = name;
    this.status = status;
    this.createdAt = createdAt;
  }
}
