import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ResponseItineraryDTO {
  @ApiProperty({
    description: 'Day number',
    example: 1,
  })
  dayNumber: number;

  @ApiProperty({
    description: 'Activity listed this day',
    example: 'camping',
  })
  activity: string;

  @ApiPropertyOptional({
    description: 'Activity additional cost (optional)',
    example: 100,
  })
  additionalCost?: number;

  @ApiPropertyOptional({
    description: 'Activity initial date (optional)',
    example: '2020-10-30T05:00:00.000Z',
  })
  initDate?: Date;

  @ApiPropertyOptional({
    description: 'Activity initial hour (optional)',
    example: '10:00',
  })
  initHour?: string;

  @ApiPropertyOptional({
    description: 'Activity finish date (optional)',
    example: '2020-10-30T05:00:00.000Z',
  })
  finishDate?: Date;

  @ApiPropertyOptional({
    description: 'Activity finish hour (optional)',
    example: '10:00',
  })
  finishHour?: string;

  @ApiPropertyOptional({
    description: 'Activity aeroline (optional)',
    example: 'Aeromexico',
  })
  aeroline?: string;

  @ApiPropertyOptional({
    description: 'Flight number (optional)',
    example: 'AM-123',
  })
  flightNumber?: string;

  @ApiPropertyOptional({
    description: 'Activity route (optional)',
    example: 'CDMX - Cancun',
  })
  route?: string;

  @ApiProperty({
    description: 'Activity order to be displayed',
    example: 1,
  })
  order: number;

  constructor(dayNumber: number, activity: string, order: number) {
    this.dayNumber = dayNumber;
    this.activity = activity;
    this.order = order;
  }
}
