import { ResponseCategoryDTO } from '../category/responsecategory.dto';
import { CategoryTransformers } from '@/shared/utilities/transformers/category.transformer';
import { OriginCityTransformers } from '@/shared/utilities/transformers/origincity.transformer';
import { ResponseTransferTypeDTO } from '../translationType/responseTranslationType.dto';
import { TranslationTypeTransformers } from '@/shared/utilities/transformers/translationtype.transformer';
import { ResponseOriginCityDTO } from '../origincity/responseorigincity.dto';
import { Expose } from 'class-transformer';
import { Types } from 'mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ResponseDestinationDTO {
  @ApiPropertyOptional()
  @Expose()
  _id?: Types.ObjectId;

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
  category?: ResponseCategoryDTO[];

  @ApiPropertyOptional({
    type: ResponseOriginCityDTO,
    isArray: true,
  })
  @Expose()
  @OriginCityTransformers()
  originCity?: ResponseOriginCityDTO[];

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
  translationType?: ResponseTransferTypeDTO[];

  @ApiPropertyOptional()
  @Expose()
  translationRoute?: string;

  @ApiPropertyOptional()
  @Expose()
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
