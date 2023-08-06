import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty } from 'class-validator';

export class TourByIncluded {
  @ApiProperty()
  @IsNotEmpty()
  @IsMongoId()
  included: string;
}
