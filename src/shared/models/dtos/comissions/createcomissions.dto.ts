import { ApiProperty } from '@nestjs/swagger';
import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Status } from 'src/shared/enums/status.enum';

export class CreateCommissionDTO {
  @ApiProperty({
    description: 'salertype catalog',
  })
  @IsNotEmpty()
  @IsMongoId()
  salerType: string;

  @ApiProperty({
    description: 'Tour type catalog',
  })
  @IsNotEmpty()
  @IsMongoId()
  tourType: string;

  @ApiProperty({
    description: 'Commission amount',
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(500)
  amount: number;

  @ApiProperty({ enum: Status })
  @IsOptional()
  @IsString()
  status?: Status;
}
