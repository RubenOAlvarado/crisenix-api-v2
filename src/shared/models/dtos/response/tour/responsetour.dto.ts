import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ResponseDestinationDTO } from '../destination/responsedestination.dto';
import { ResponseAboardHourDTO } from './responseaboardhour.dto';
import { AboardHourTransformer } from '@/shared/utilities/transformers/aboardhour.transformer';
import { ResponseTransportsDTO } from '../transports/responsetransports.dto';
import { ResponseCoordinatorDto } from './response-coordinator.dto';
import { ResponseTourTypeDTO } from '../tourType/responseTourType.dto';
import { ResponseIncludedDTO } from '../included/responseIncluded.dto';
import { IncludedTransformers } from '../../../utilities/transformers/included.transformer';
import { ResponseItineraryDTO } from './reponseitinerary.dto';
import { ResponsePriceDTO } from '../price/responseprice.dto';
import { ItineraryTransformers } from '@/shared/utilities/transformers/itinerary.transformer';

export class ResponseTourDTO {
  @ApiProperty({
    description: 'Destination',
    type: ResponseDestinationDTO,
  })
  destination: ResponseDestinationDTO;

  @ApiPropertyOptional({
    description: 'Box lunch indicator',
    type: String,
  })
  boxLunch?: string;

  @ApiProperty({
    description: 'Tour code',
    type: String,
  })
  code: string;

  @ApiProperty({
    description: 'Tour seats number',
    type: Number,
  })
  seating: number;

  @ApiPropertyOptional({
    description: 'Available seats',
    type: Number,
  })
  availableSeat?: number;

  @ApiPropertyOptional({
    description: 'Ocuppied seats',
    type: Number,
  })
  ocuppiedSeat?: number;

  @ApiProperty({
    description: 'Tour initial date',
    type: Date,
  })
  initDate: Date;

  @ApiPropertyOptional({
    type: ResponseAboardHourDTO,
    isArray: true,
  })
  @AboardHourTransformer()
  aboardHour?: ResponseAboardHourDTO[];

  @ApiPropertyOptional({
    description: 'Tour days long',
    type: Number,
  })
  days?: number;

  @ApiPropertyOptional({
    description: 'Tour nights long',
    type: Number,
  })
  nights?: number;

  @ApiProperty({
    description: 'Tour transport',
    type: ResponseTransportsDTO,
  })
  transport: ResponseTransportsDTO;

  @ApiProperty({
    description: 'Tour return date',
    type: Date,
  })
  returnDate: Date;

  @ApiPropertyOptional({
    description: 'Tour return hour',
    type: ResponseAboardHourDTO,
  })
  returnHour?: ResponseAboardHourDTO;

  @ApiPropertyOptional({
    description: 'Tour departure',
    type: String,
    isArray: true,
  })
  departure?: string[];

  @ApiPropertyOptional({
    description: 'Coordinator/s assigned to tour',
    type: ResponseCoordinatorDto,
  })
  coordinator?: ResponseCoordinatorDto;

  @ApiPropertyOptional({
    description: 'Tour front image',
    type: String,
  })
  front?: string;

  @ApiPropertyOptional({
    description: 'Tour recommendations',
    type: String,
  })
  recommendations?: string;

  @ApiProperty({
    description: 'Tour type',
    type: ResponseTourTypeDTO,
  })
  tourType: ResponseTourTypeDTO;

  @ApiPropertyOptional({
    description: 'Tour included services',
    type: ResponseIncludedDTO,
    isArray: true,
  })
  @IncludedTransformers()
  included?: ResponseIncludedDTO[];

  @ApiPropertyOptional({
    description: 'Tour itinerary, day by day',
    type: ResponseItineraryDTO,
    isArray: true,
  })
  @ItineraryTransformers()
  itinerary?: ResponseItineraryDTO[];

  @ApiPropertyOptional({
    description: 'Tour price',
    type: ResponsePriceDTO,
    isArray: true,
  })
  price?: ResponsePriceDTO[];

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
