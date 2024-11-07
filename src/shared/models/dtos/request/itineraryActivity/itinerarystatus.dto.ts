import { ItineraryActivityStatus } from '@/shared/enums/itineraries/itinerary.status.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

export class ItineraryActivityStatusDto {
  @ApiProperty({
    description: 'Status to look for',
    example: 'Activo',
    enum: ItineraryActivityStatus,
    default: ItineraryActivityStatus.ACTIVE,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsEnum(ItineraryActivityStatus)
  status!: ItineraryActivityStatus;
}
