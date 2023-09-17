import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { State } from 'src/shared/enums/sales/state.enum';
import { FailureReason } from 'src/shared/enums/sales/failureReason.enum';

export class PaypalResponse {
  @ApiProperty({
    description: 'Sale id',
    example: '5f9d7a3b9d7a3b9d7a3b9d7a',
  })
  @IsNotEmpty()
  @IsMongoId()
  sale: string;

  @ApiPropertyOptional({
    example: '5f9d7a3b9d7a3b9d7a3b9d7a',
  })
  @IsOptional()
  @IsString()
  operationId?: string;

  @ApiProperty({
    description: 'Sale state',
    example: State.APPROVED,
    enum: State,
  })
  @IsNotEmpty()
  state: State;

  @ApiProperty({
    description: 'Sale failure reason if presented',
    example: FailureReason.INVALID_PAYMENT_METHOD,
    enum: FailureReason,
  })
  @IsNotEmpty()
  failureReason: FailureReason;

  constructor(sale: string, state: State, failureReason: FailureReason) {
    this.sale = sale;
    this.state = state;
    this.failureReason = failureReason;
  }
}
