import { Sales } from '@/shared/models/schemas/sales.schema';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ResponseSavedPaypalResponse {
  @ApiProperty()
  @Expose()
  message: string;

  @ApiProperty()
  @Expose()
  sale: Sales;

  constructor(message: string, sale?: any) {
    this.message = message;
    this.sale = sale;
  }
}
