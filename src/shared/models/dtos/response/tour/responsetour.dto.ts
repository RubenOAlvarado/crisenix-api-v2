import { ResponseDestinationDTO } from '../destination/responsedestination.dto';
import { ResponseAboardHourDTO } from './responseaboardhour.dto';
import { AboardHourTransformer } from '@/shared/utilities/transformers/aboardhour.transformer';
import { ResponseTransportsDTO } from '../transports/responsetransports.dto';
import { ResponseCoordinatorDto } from './response-coordinator.dto';
import { ResponseTourTypeDTO } from '../tourType/responseTourType.dto';
import { ResponseIncludedDTO } from '../included/responseIncluded.dto';
import { ResponseItineraryDTO } from './reponseitinerary.dto';
import { ItineraryTransformers } from '@/shared/utilities/transformers/itinerary.transformer';
import { IncludedTransformers } from '@/shared/utilities/transformers/included.transformer';
import { Expose, Type } from 'class-transformer';
import { Types } from 'mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ResponseTourDTO {
  @ApiPropertyOptional()
  @Expose()
  _id?: Types.ObjectId;

  @ApiProperty()
  @Type(() => ResponseDestinationDTO)
  @Expose()
  destination: ResponseDestinationDTO;

  @ApiPropertyOptional()
  @Expose()
  boxLunch?: string;

  @ApiProperty()
  @Expose()
  code: string;

  @ApiProperty()
  @Expose()
  seating: number;

  @ApiPropertyOptional()
  @Expose()
  availableSeat?: number;

  @ApiPropertyOptional()
  @Expose()
  ocuppiedSeat?: number;

  @ApiProperty()
  @Expose()
  initDate: Date;

  @ApiPropertyOptional({
    type: ResponseAboardHourDTO,
    isArray: true,
  })
  @Expose()
  @Type(() => ResponseAboardHourDTO)
  @AboardHourTransformer()
  aboardHour?: ResponseAboardHourDTO[];

  @ApiPropertyOptional()
  @Expose()
  days?: number;

  @ApiPropertyOptional()
  @Expose()
  nights?: number;

  @ApiProperty()
  @Type(() => ResponseTransportsDTO)
  @Expose()
  transport: ResponseTransportsDTO;

  @ApiProperty()
  @Expose()
  returnDate: Date;

  @ApiPropertyOptional()
  @Type(() => ResponseAboardHourDTO)
  @Expose()
  returnHour?: ResponseAboardHourDTO;

  @ApiPropertyOptional()
  @Expose()
  departure?: string[];

  @ApiPropertyOptional()
  @Expose()
  @Type(() => ResponseCoordinatorDto)
  coordinator?: ResponseCoordinatorDto;

  @ApiPropertyOptional()
  @Expose()
  front?: string;

  @ApiPropertyOptional()
  @Expose()
  recommendations?: string;

  @ApiProperty()
  @Type(() => ResponseTourTypeDTO)
  @Expose()
  tourType: ResponseTourTypeDTO;

  @ApiPropertyOptional({
    type: ResponseIncludedDTO,
    isArray: true,
  })
  @Expose()
  @Type(() => ResponseIncludedDTO)
  @IncludedTransformers()
  included?: ResponseIncludedDTO[];

  @ApiPropertyOptional({
    type: ResponseItineraryDTO,
    isArray: true,
  })
  @Expose()
  @Type(() => ResponseItineraryDTO)
  @ItineraryTransformers()
  itinerary?: ResponseItineraryDTO[];

  constructor(
    destination: ResponseDestinationDTO,
    code: string,
    seating: number,
    initDate: Date,
    transport: ResponseTransportsDTO,
    returnDate: Date,
    tourType: ResponseTourTypeDTO,
  ) {
    this.destination = destination;
    this.code = code;
    this.seating = seating;
    this.initDate = initDate;
    this.transport = transport;
    this.returnDate = returnDate;
    this.tourType = tourType;
  }
}
