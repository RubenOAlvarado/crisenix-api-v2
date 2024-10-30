import { ReservationStatus } from '@/shared/enums/reservation-status.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsDateString,
  IsEmail,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  ValidateIf,
} from 'class-validator';

export class CreateReservationsDTO {
  @ApiProperty({
    description: 'Reservation status',
    enum: ReservationStatus,
    default: ReservationStatus.RESERVED,
  })
  @IsEnum(ReservationStatus)
  @IsNotEmpty()
  status: ReservationStatus;

  @ApiProperty({
    description: 'Tour ID',
    example: '60f4b3b3b3b3b3b3b3b3b3b3',
  })
  @IsMongoId()
  @IsNotEmpty()
  tour: string;

  @ApiPropertyOptional({
    description: 'User ID',
    example: '60f4b3b3b3b3b3b3b3b3b3b3',
  })
  @IsOptional()
  @IsMongoId()
  user?: string;

  @ApiPropertyOptional({
    example: 'Juan',
    description: 'Client name',
  })
  @ValidateIf((o) => !o.user)
  @IsNotEmpty({ message: 'Client name is required when user is not provided' })
  @IsString()
  @MaxLength(150)
  clientName?: string;

  @ApiPropertyOptional({
    example: 'Perez',
    description: 'Client last name',
  })
  @ValidateIf((o) => !o.user)
  @IsNotEmpty({
    message: 'Client last name is required when user is not provided',
  })
  @IsString()
  @MaxLength(150)
  clientLastName?: string;

  @ApiPropertyOptional({
    example: 'Gonzalez',
    description: 'Client mother last name',
  })
  @ValidateIf((o) => !o.user)
  @IsNotEmpty({
    message: 'Client mother last name is required when user is not provided',
  })
  @IsString()
  @MaxLength(150)
  clientMotherLastName?: string;

  @ApiPropertyOptional({
    description: 'Client email',
    example: 'test@testing.com',
  })
  @ValidateIf((o) => !o.user)
  @IsNotEmpty({ message: 'Client email is required when user is not provided' })
  @IsString()
  @IsEmail({}, { message: 'Invalid email format' })
  email?: string;

  @ApiProperty({
    description: 'Reserved total seats',
    default: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  totalSeats: number;

  @ApiPropertyOptional({
    description: "Passengers ID's",
    example: ['60f4b3b3b3b3b3b3b3b3b3b3'],
    type: [String],
    isArray: true,
  })
  @IsOptional()
  @ArrayNotEmpty()
  @IsMongoId({ each: true })
  passengers?: string[];

  @ApiProperty({
    description: 'Reservation payment deadline',
    example: new Date(),
    type: Date,
  })
  @IsNotEmpty({ message: 'Payment deadline is required' })
  @IsDateString()
  paymentDeadline: Date;

  constructor(
    status: ReservationStatus,
    tour: string,
    totalSeats: number,
    paymentDeadline: Date,
  ) {
    this.status = status;
    this.tour = tour;
    this.totalSeats = totalSeats;
    this.paymentDeadline = paymentDeadline;
  }
}
