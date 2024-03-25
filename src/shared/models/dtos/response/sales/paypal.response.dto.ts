import { State } from 'src/shared/enums/sales/state.enum';
import { FailureReason } from 'src/shared/enums/sales/failureReason.enum';
import { Expose } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PaypalResponse {
  @ApiProperty()
  @Expose()
  sale: string;

  @ApiPropertyOptional()
  @Expose()
  operationId?: string;

  @ApiProperty()
  @Expose()
  state: State;

  @ApiProperty()
  @Expose()
  failureReason: FailureReason;

  constructor(sale: string, state: State, failureReason: FailureReason) {
    this.sale = sale;
    this.state = state;
    this.failureReason = failureReason;
  }
}
