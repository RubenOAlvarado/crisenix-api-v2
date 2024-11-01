import { FailureReason } from '@/shared/enums/sales/failureReason.enum';
import { UrlValidator } from '@/shared/validators/urlValidator.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class DeclineSaleDto extends UrlValidator {
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

  constructor(id: string, failureReason: FailureReason) {
    super(id);
    this.failureReason = failureReason;
  }
}
