import { ResponseCategoryDTO } from '../category/responsecategory.dto';
import { CategoryTransformers } from '@/shared/utilities/transformers/category.transformer';
import { OriginCityTransformers } from '@/shared/utilities/transformers/origincity.transformer';
import { ResponseTransferTypeDTO } from '../translationType/responseTranslationType.dto';
import { TranslationTypeTransformers } from '@/shared/utilities/transformers/translationtype.transformer';
import { ResponseOriginCityDTO } from '../origincity/responseorigincity.dto';
import { Expose } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ObjectIdToString } from '@/shared/decorators/objectIdTransformer.transformer';

export class ResponseDestinationDTO {
  @ApiPropertyOptional()
  @Expose()
  @ObjectIdToString()
  _id?: string;

  @ApiProperty()
  @Expose()
  code: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiPropertyOptional()
  @Expose()
  description?: string;

  @ApiPropertyOptional({
    type: ResponseCategoryDTO,
    isArray: true,
  })
  @Expose()
  @CategoryTransformers()
  categories?: string[] | ResponseCategoryDTO[];

  @ApiPropertyOptional({
    type: ResponseOriginCityDTO,
    isArray: true,
  })
  @Expose()
  @OriginCityTransformers()
  originCities?: string[] | ResponseOriginCityDTO[];

  @ApiPropertyOptional()
  @Expose()
  tentativeDates?: string;

  @ApiPropertyOptional()
  @Expose()
  passport?: boolean;

  @ApiProperty()
  @Expose()
  visa: string;

  @ApiPropertyOptional({
    type: ResponseTransferTypeDTO,
    isArray: true,
  })
  @Expose()
  @TranslationTypeTransformers()
  transferTypes?: string[] | ResponseTransferTypeDTO[];

  @ApiPropertyOptional()
  @Expose()
  translationRoute?: string;

  @ApiPropertyOptional()
  @Expose()
  photos?: string[];

  constructor(
    _id: string,
    code: string,
    name: string,
    description: string,
    tentativeDates: string,
    visa: string,
    translationRoute: string,
    photos: string[],
  ) {
    this._id = _id;
    this.code = code;
    this.name = name;
    this.description = description;
    this.tentativeDates = tentativeDates;
    this.visa = visa;
    this.translationRoute = translationRoute;
    this.photos = photos;
  }
}
