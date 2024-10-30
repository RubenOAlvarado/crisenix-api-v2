import { FailureReason } from '@/shared/enums/sales/failureReason.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class DeclineSaleDto {
  @ApiProperty({
    description: 'Reason for declining the sale',
    required: true,
    example: FailureReason.INVALID_PAYMENT_METHOD,
    type: String,
    enum: FailureReason,
  })
  @IsNotEmpty()
  @IsEnum(FailureReason)
  failureReason: FailureReason;

  constructor(failureReason: FailureReason) {
    this.failureReason = failureReason;
  }
}
