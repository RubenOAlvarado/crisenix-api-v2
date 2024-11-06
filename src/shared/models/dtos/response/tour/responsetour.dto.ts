import { ResponseDestinationDTO } from '../destination/responsedestination.dto';
import { ResponseTransportsDTO } from '../transports/responsetransports.dto';
import { ResponseTourTypeDTO } from '../tourType/responseTourType.dto';
import { Expose, Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AboardHourTransformer } from '@/shared/utilities/transformers/aboardhour.transformer';
import { ResponseAboardHourDTO } from './responseaboardhour.dto';
import { ResponseCoordinatorDto } from './response-coordinator.dto';
import { ObjectIdToString } from '@/shared/decorators/objectIdTransformer.transformer';
import { ResponsePriceDTO } from '../price/responseprice.dto';
import { PriceTransformers } from '@/shared/utilities/transformers/price.transformer';

export class ResponseTourDTO {
  @ApiPropertyOptional()
  @Expose()
  @ObjectIdToString()
  _id?: string;

  @ApiProperty()
  @Type(() => ResponseDestinationDTO)
  @Expose()
  destination: ResponseDestinationDTO | string;

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

  @ApiProperty({
    type: ResponsePriceDTO,
    isArray: true,
  })
  @Expose()
  @Type(() => ResponsePriceDTO)
  @PriceTransformers()
  prices: ResponsePriceDTO[] | string[];

  @ApiProperty()
  @Expose()
  status: string;

  constructor(
    destination: ResponseDestinationDTO | string,
    code: string,
    seating: number,
    initDate: Date,
    transport: ResponseTransportsDTO | string,
    returnDate: Date,
    tourType: ResponseTourTypeDTO | string,
    prices: ResponsePriceDTO[] | string[],
    status: string,
    _id?: string,
    availableSeat?: number,
    ocuppiedSeat?: number,
    aboardHour?: ResponseAboardHourDTO[] | string[],
    days?: number,
    nights?: number,
    returnHour?: ResponseAboardHourDTO[] | string[],
    coordinators?: ResponseCoordinatorDto[],
    front?: string,
    recommendations?: string,
  ) {
    this._id = _id;
    this.destination = destination;
    this.code = code;
    this.seating = seating;
    this.availableSeat = availableSeat;
    this.ocuppiedSeat = ocuppiedSeat;
    this.initDate = initDate;
    this.aboardHour = aboardHour;
    this.days = days;
    this.nights = nights;
    this.transport = transport;
    this.returnDate = returnDate;
    this.returnHour = returnHour;
    this.coordinators = coordinators;
    this.front = front;
    this.recommendations = recommendations;
    this.tourType = tourType;
    this.prices = prices;
    this.status = status;
  }
}
