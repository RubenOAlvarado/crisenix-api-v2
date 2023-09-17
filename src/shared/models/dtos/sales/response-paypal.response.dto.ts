import { ApiProperty } from '@nestjs/swagger';

export class ResponseSavedPaypalResponse {
  @ApiProperty({
    description: 'Response message',
  })
  message: string;

  @ApiProperty({
    description: 'Sale Object',
  })
  sale: any;

  constructor(message: string, sale: any) {
    this.message = message;
    this.sale = sale;
  }
}
