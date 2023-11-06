import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ResponseOriginCityDTO } from '../originCity/responseorigincity.dto';

export class ResponsePriceDTO {
  @ApiProperty({
    description: 'City.',
  })
  city: ResponseOriginCityDTO;

  @ApiProperty({
    description: 'Price currency.',
    example: 'MX',
  })
  currency: string;

  @ApiPropertyOptional({
    description: 'General price (not base applied).',
  })
  general?: number;

  @ApiPropertyOptional({
    description: 'Single base price.',
  })
  singleBase?: number;

  @ApiPropertyOptional({
    description: 'Double base price.',
  })
  doubleBase?: number;

  @ApiPropertyOptional({
    description: 'Triple base price.',
  })
  tripleBase?: number;

  @ApiPropertyOptional({
    description: 'Quadruple base price.',
  })
  quadrupleBase?: number;

  @ApiPropertyOptional({
    description: 'Child price.',
  })
  minor?: number;

  @ApiPropertyOptional({
    description: 'Old people price.',
  })
  inapam?: number;

  constructor(city: ResponseOriginCityDTO, currency: string) {
    this.city = city;
    this.currency = currency;
  }
}
