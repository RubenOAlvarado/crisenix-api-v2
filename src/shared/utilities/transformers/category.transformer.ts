import { applyDecorators } from '@nestjs/common';
import { Expose, Transform } from 'class-transformer';
import { ResponseCategoryDTO } from '@/shared/models/dtos/response/category/responsecategory.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CategoryLean } from '@/shared/interfaces/category/category.lean.interface';

export const categoryTransformer = ({ value }: { value: CategoryLean[] }) => {
  if (value?.length) {
    return value.map(({ _id, label, status, main }) => {
      return new ResponseCategoryDTO(label, status, main, _id.toHexString());
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
