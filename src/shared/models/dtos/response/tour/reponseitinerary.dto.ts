import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ResponseClassificationDTO } from '../classifications/responseclassifications.dto';
import { ClassificationTransformers } from '@/shared/utilities/transformers/classifications.transformer';

export class ResponseItineraryDTO {
  @ApiProperty()
  @Expose()
  dayNumber: number;

  @ApiProperty({
    type: ResponseClassificationDTO,
  })
  @Expose()
  @Type(() => ResponseClassificationDTO)
  @ClassificationTransformers()
  classification: ResponseClassificationDTO | string;

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

  constructor(
    dayNumber: number,
    classification: string,
    order: number,
    additionalCost?: number,
    initDate?: Date,
    initHour?: string,
    finishDate?: Date,
    finishHour?: string,
    route?: string,
  ) {
    this.dayNumber = dayNumber;
    this.classification = classification;
    this.order = order;
    this.additionalCost = additionalCost;
    this.initDate = initDate;
    this.initHour = initHour;
    this.finishDate = finishDate;
    this.finishHour = finishHour;
    this.route = route;
  }
}
