import { applyDecorators } from '@nestjs/common';
import { Expose, Transform } from 'class-transformer';
import { ResponseCategoryDTO } from '@/shared/models/dtos/response/category/responsecategory.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CategoryLean } from '@/shared/types/category/category.lean.type';
import { handleDocumentsId } from '../helpers';

export const categoryTransformer = ({ value }: { value: CategoryLean[] }) => {
  if (value?.length) {
    return value.map(({ _id, label, status, main }) => {
      return new ResponseCategoryDTO(
        label,
        status,
        main,
        handleDocumentsId(_id),
      );
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
