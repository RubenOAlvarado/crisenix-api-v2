import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { State } from 'src/shared/enums/sales/state.enum';
import { FailureReason } from 'src/shared/enums/sales/failureReason.enum';

export class PaypalResponse {
  @ApiProperty()
  @IsNotEmpty()
  @IsMongoId()
  sale: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  operationId?: string;

  @ApiProperty({ enum: State })
  @IsNotEmpty()
  state: State;

  @ApiProperty({ enum: FailureReason })
  @IsNotEmpty()
  failureReason: FailureReason;

  constructor(sale: string, state: State, failureReason: FailureReason) {
    this.sale = sale;
    this.state = state;
    this.failureReason = failureReason;
  }
}
