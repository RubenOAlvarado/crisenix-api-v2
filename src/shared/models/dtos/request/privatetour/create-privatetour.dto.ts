import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsInt,
  IsMobilePhone,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreatePrivatetourDto {
  @ApiProperty({
    description: 'Name of the person who is requesting the private tour',
    example: 'John Doe',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(250)
  name: string;

  @ApiProperty({
    description:
      'Phone number of the person who is requesting the private tour',
    example: '+573002222222',
  })
  @IsNotEmpty()
  @IsMobilePhone()
  phone: string;

  @ApiProperty({
    description: 'Email of the person who is requesting the private tour',
    example: 'test@testing.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Destination of the private tour',
    example: 'Cartagena',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(300)
  destination: string;

  @ApiProperty({
    description: 'Origin of the private tour',
    example: 'Medellín',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(300)
  origin: string;

  @ApiProperty({
    description: 'Initial date of the private tour',
    example: '2021-12-31',
  })
  @IsNotEmpty()
  @IsString()
  initDate: string;

  @ApiProperty({
    description: 'Return date of the private tour',
    example: '2021-12-31',
  })
  @IsNotEmpty()
  @IsString()
  returnDate: string;

  @ApiProperty({
    description: 'Number of adults of the private tour',
    example: 2,
  })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  adults: number;

  @ApiPropertyOptional({
    description: 'Number of children of the private tour',
    example: 2,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  childrens?: number;

  @ApiProperty({
    description: 'Description of the private tour',
    example: 'This is a description of the private tour',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(1000)
  tourDescription: string;

  constructor(
    name: string,
    phone: string,
    email: string,
    destination: string,
    origin: string,
    initDate: string,
    returnDate: string,
    adults: number,
    tourDescription: string,
  ) {
    this.name = name;
    this.phone = phone;
    this.email = email;
    this.destination = destination;
    this.origin = origin;
    this.initDate = initDate;
    this.returnDate = returnDate;
    this.adults = adults;
    this.tourDescription = tourDescription;
  }
}
