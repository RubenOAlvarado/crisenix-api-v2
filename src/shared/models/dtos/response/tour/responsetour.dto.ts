import { ResponseDestinationDTO } from '../destination/responsedestination.dto';
import { ResponseTransportsDTO } from '../transports/responsetransports.dto';
import { ResponseTourTypeDTO } from '../tourType/responseTourType.dto';
import { Expose, Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AboardHourTransformer } from '@/shared/utilities/transformers/aboardhour.transformer';
import { ResponseAboardHourDTO } from './responseaboardhour.dto';
import { ResponseCoordinatorDto } from './response-coordinator.dto';
import { ResponseIncludedDTO } from '../included/responseIncluded.dto';
import { ResponseItineraryDTO } from './reponseitinerary.dto';
import { ItineraryTransformers } from '@/shared/utilities/transformers/itinerary.transformer';
import { IncludedTransformers } from '@/shared/utilities/transformers/included.transformer';
import { ObjectIdToString } from '@/shared/decorators/objectIdTransformer.transformer';

export class ResponseTourDTO {
  @ApiPropertyOptional()
  @Expose()
  @ObjectIdToString()
  _id?: string;

  @ApiProperty()
  @Type(() => ResponseDestinationDTO)
  @Expose()
  destination: ResponseDestinationDTO | string;

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
  aboardHour?: ResponseAboardHourDTO[] | string[];

  @ApiPropertyOptional()
  @Expose()
  days?: number;

  @ApiPropertyOptional()
  @Expose()
  nights?: number;

  @ApiProperty()
  @Type(() => ResponseTransportsDTO)
  @Expose()
  transport: ResponseTransportsDTO | string;

  @ApiProperty()
  @Expose()
  returnDate: Date;

  @ApiPropertyOptional({
    type: ResponseAboardHourDTO,
    isArray: true,
  })
  @Expose()
  @Type(() => ResponseAboardHourDTO)
  @AboardHourTransformer()
  returnHour?: ResponseAboardHourDTO[] | string[];

  @ApiPropertyOptional({
    type: ResponseCoordinatorDto,
    isArray: true,
  })
  @Expose()
  @Type(() => ResponseCoordinatorDto)
  coordinators?: ResponseCoordinatorDto[];

  @ApiPropertyOptional()
  @Expose()
  front?: string;

  @ApiPropertyOptional()
  @Expose()
  recommendations?: string;

  @ApiProperty()
  @Type(() => ResponseTourTypeDTO)
  @Expose()
  tourType: ResponseTourTypeDTO | string;

  @ApiPropertyOptional({
    type: ResponseIncludedDTO,
    isArray: true,
  })
  @Expose()
  @Type(() => ResponseIncludedDTO)
  @IncludedTransformers()
  includeds?: ResponseIncludedDTO[] | string[];

  @ApiPropertyOptional({
    type: ResponseItineraryDTO,
    isArray: true,
  })
  @Expose()
  @Type(() => ResponseItineraryDTO)
  @ItineraryTransformers()
  itineraries?: ResponseItineraryDTO[] | string[];

  constructor(
    destination: ResponseDestinationDTO | string,
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
