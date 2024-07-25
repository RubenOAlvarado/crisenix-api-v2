import { Categories } from '@/shared/models/schemas/category.schema';
import { applyDecorators } from '@nestjs/common';
import { Expose, Transform } from 'class-transformer';
import { ResponseCategoryDTO } from '@/shared/models/dtos/response/category/responsecategory.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export const categoryTransformer = ({ value }: { value: Categories[] }) => {
  if (value?.length) {
    return value.map(({ label, status, main }) => {
      return new ResponseCategoryDTO(label, status, main);
    });
  }
  return undefined;
};

export const CategoryTransformers = () =>
  applyDecorators(
    ApiPropertyOptional(),
    Expose(),
    Transform(categoryTransformer),
  );
