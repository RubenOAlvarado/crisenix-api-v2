import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PriceBase } from '@/shared/enums/priceBase.enum';

export class CreatePassengerDTO {
  @ApiProperty({
    description: 'Passenger name',
    example: 'John',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  name: string;

  @ApiProperty({
    description: 'Passenger last name',
    example: 'Doe',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  lastName: string;

  @ApiPropertyOptional({
    description: 'Passenger second last name',
    example: 'Doe',
  })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  motherLastName?: string;

  @ApiProperty({
    description: 'Passenger aboard point',
  })
  @IsNotEmpty({ message: 'Aboard point is required' })
  @IsMongoId({ message: 'Aboard point must be a valid ObjectId' })
  aboardPoint: string;

  @ApiProperty({
    description: 'Passenger base',
    example: 'general',
    enum: PriceBase,
  })
  @IsNotEmpty()
  @IsEnum(PriceBase)
  base: PriceBase;

  @ApiProperty({
    description: 'Reservation id',
    example: '123456789012345678901234',
  })
  @IsNotEmpty({ message: 'Reservation is required' })
  @IsMongoId({ message: 'Reservation must be a valid ObjectId' })
  reservation: string;

  constructor(
    name: string,
    lastName: string,
    aboardPoint: string,
    base: PriceBase,
    reservation: string,
  ) {
    this.name = name;
    this.lastName = lastName;
    this.aboardPoint = aboardPoint;
    this.base = base;
    this.reservation = reservation;
  }
}
