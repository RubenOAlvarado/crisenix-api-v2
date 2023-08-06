import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateDepartureDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(5)
  terminal: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  aeroline: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  route: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(5)
  gate: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(5)
  flight: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(10)
  hour: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  date: Date;
}
