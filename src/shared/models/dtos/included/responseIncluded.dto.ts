import { Entry } from '@/shared/enums/entry.enum';
import { HotelStatus } from '@/shared/enums/hotelstatus.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ResponseIncludedDTO {
  @ApiProperty({
    description: 'Service concept',
    example: 'Desayno completo',
  })
  concept: string;

  @ApiProperty({
    description: 'Included indicator',
    example: 'SI',
  })
  included: string;

  @ApiProperty({
    description: 'Publish indicator',
    example: 'SI',
  })
  publish: string;

  @ApiProperty({
    description: 'Entry indicator',
    example: Entry.HOSPEDAJE,
    enum: Entry,
  })
  entry: Entry;

  @ApiProperty({
    description: 'Service status',
    example: 'ACTIVO',
  })
  status: string;

  @ApiPropertyOptional({
    description: `City name, if entry is ${Entry.HOSPEDAJE}`,
    example: 'Ciudad de México',
  })
  city?: string;

  @ApiPropertyOptional({
    description: `Hotel name, if entry is ${Entry.HOSPEDAJE}`,
    example: 'Fiesta Inn',
  })
  hotel?: string;

  @ApiPropertyOptional({
    enum: HotelStatus,
    description: `Hotel status, if entry is ${Entry.HOSPEDAJE}`,
    example: HotelStatus.TENTATIVO,
  })
  hotelStatus?: HotelStatus;

  @ApiPropertyOptional({
    description: `Hotel address, if entry is ${Entry.HOSPEDAJE}`,
    example: 'Av. Insurgentes Sur 553, Roma Sur, 06760 Cuauhtémoc, CDMX',
  })
  hotelAddress?: string;

  @ApiPropertyOptional({
    description: `Hotel phone, if entry is ${Entry.HOSPEDAJE}`,
    example: '55 1234 5678',
  })
  phone?: string;

  @ApiPropertyOptional({
    description: `Reserved nights, if entry is ${Entry.HOSPEDAJE}`,
    example: 2,
  })
  nights?: number;

  @ApiPropertyOptional({
    description: `Check in date, if entry is ${Entry.HOSPEDAJE}`,
    example: '2020-10-30T05:00:00.000Z',
  })
  checkIn?: Date;

  @ApiPropertyOptional({
    description: `Check out date, if entry is ${Entry.HOSPEDAJE}`,
    example: '2020-10-30T05:00:00.000Z',
  })
  checkOut?: Date;

  @ApiPropertyOptional({
    description: `Single room price, if entry is ${Entry.HOSPEDAJE}`,
    example: 2000,
  })
  single?: number;

  @ApiPropertyOptional({
    description: `Single base room price, if entry is ${Entry.HOSPEDAJE}`,
    example: 2000,
  })
  singleBase?: number;

  @ApiPropertyOptional({
    description: `Double base room price, if entry is ${Entry.HOSPEDAJE}`,
    example: 2000,
  })
  doubleBase?: number;

  @ApiPropertyOptional({
    description: `Triple base room price, if entry is ${Entry.HOSPEDAJE}`,
    example: 2000,
  })
  tripleBase?: number;

  @ApiPropertyOptional({
    description: `Quadruple base room price, if entry is ${Entry.HOSPEDAJE}`,
    example: 2000,
  })
  quadrupleBase?: number;

  @ApiPropertyOptional({
    description: `Child base room price, if entry is ${Entry.HOSPEDAJE}`,
    example: 2000,
  })
  minor?: number;

  @ApiPropertyOptional({
    description: `Inpam room price (adults + 60 years old), if entry is ${Entry.HOSPEDAJE}`,
    example: 2000,
  })
  inpam?: number;

  constructor(
    concept: string,
    included: string,
    publish: string,
    entry: Entry,
    status: string,
  ) {
    this.concept = concept;
    this.included = included;
    this.publish = publish;
    this.entry = entry;
    this.status = status;
  }
}
