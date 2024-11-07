import { ResponseCategoryDTO } from '../category/responsecategory.dto';
import { CategoryTransformers } from '@/shared/utilities/transformers/category.transformer';
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

  @ApiPropertyOptional()
  @Expose()
  tentativeDates?: string;

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
    photos: string[],
  ) {
    this._id = _id;
    this.code = code;
    this.name = name;
    this.description = description;
    this.tentativeDates = tentativeDates;
    this.photos = photos;
  }
}
