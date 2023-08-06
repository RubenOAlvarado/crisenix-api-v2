import {
  IsDateString,
  IsEmail,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SalesStatus } from '../../../enums/sales/salesstatus.enum';
import { SaleOrigin } from '../../../enums/sales/saleorigin.enum';

export class CreateSaleDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsMongoId()
  tour: string;

  @ApiPropertyOptional({ enum: SalesStatus })
  @IsOptional()
  @IsString()
  status?: SalesStatus;

  @ApiProperty({ enum: SaleOrigin })
  @IsNotEmpty()
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  clientName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  clientLastName: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(150)
  clientMotherLastName?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  oficialId?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  reservedSeat: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  reservationDate: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  payLimitDate?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  totalPayedMount?: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  payDate: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsMongoId()
  saler?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsMongoId({ each: true })
  passenger?: Array<string>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsMongoId()
  user?: string;
}
