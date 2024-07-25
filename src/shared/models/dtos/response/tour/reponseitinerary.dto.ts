import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ResponseItineraryDTO {
  @ApiProperty()
  @Expose()
  dayNumber: number;

  @ApiProperty()
  @Expose()
  clasification: string;

  @ApiProperty()
  @Expose()
  additionalCost?: number;

  @ApiPropertyOptional()
  @Expose()
  initDate?: Date;

  @ApiPropertyOptional()
  @Expose()
  initHour?: string;

  @ApiPropertyOptional()
  @Expose()
  finishDate?: Date;

  @ApiPropertyOptional()
  @Expose()
  finishHour?: string;

  @ApiPropertyOptional()
  @Expose()
  route?: string;

  @ApiProperty()
  @Expose()
  order: number;

  constructor(dayNumber: number, clasification: string, order: number) {
    this.dayNumber = dayNumber;
    this.clasification = clasification;
    this.order = order;
  }
}
