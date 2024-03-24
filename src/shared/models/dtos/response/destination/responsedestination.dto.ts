import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ResponseCategoryDTO } from '../category/responsecategory.dto';
import { CategoryTransformers } from '@/shared/utilities/transformers/category.transformer';
import { OriginCityTransformers } from '@/shared/utilities/transformers/origincity.transformer';
import { ResponseTranslationTypeDTO } from '../translationType/responseTranslationType.dto';
import { TranslationTypeTransformers } from '@/shared/utilities/transformers/translationtype.transformer';
import { ResponseOriginCityDTO } from '../origincity/responseorigincity.dto';

export class ResponseDestinationDTO {
  @ApiProperty({
    type: String,
    description: 'Destination code',
  })
  code: string;

  @ApiProperty({
    type: String,
    description: 'Destination name',
  })
  name: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Destination description',
  })
  description?: string;

  @ApiPropertyOptional({ type: ResponseCategoryDTO, isArray: true })
  @CategoryTransformers()
  category?: ResponseCategoryDTO[];

  @ApiPropertyOptional({ type: ResponseOriginCityDTO, isArray: true })
  @OriginCityTransformers()
  originCity?: ResponseOriginCityDTO[];

  @ApiPropertyOptional({
    description: 'Destination tentative dates',
    type: String,
  })
  tentativeDates?: string;

  @ApiPropertyOptional({
    description: 'Destination passport indicator',
    type: Boolean,
  })
  passport?: boolean;

  @ApiProperty({
    description: 'Destination visa indicator',
    type: String,
  })
  visa: string;

  @ApiPropertyOptional({
    type: ResponseTranslationTypeDTO,
    isArray: true,
  })
  @TranslationTypeTransformers()
  translationType?: ResponseTranslationTypeDTO[];

  @ApiPropertyOptional({
    type: String,
    description: 'Destination translation route',
  })
  translationRoute?: string;

  @ApiPropertyOptional({
    type: String,
    isArray: true,
    description: 'Destination photos',
  })
  photos?: string[];

  constructor(
    code: string,
    name: string,
    description: string,
    tentativeDates: string,
    visa: string,
    translationRoute: string,
    photos: string[],
  ) {
    this.code = code;
    this.name = name;
    this.description = description;
    this.tentativeDates = tentativeDates;
    this.visa = visa;
    this.translationRoute = translationRoute;
    this.photos = photos;
  }
}
