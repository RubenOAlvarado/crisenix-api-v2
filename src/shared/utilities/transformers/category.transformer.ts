import { ResponseCategoryDTO } from '@/shared/models/dtos/category/responsecategory.dto';
import { Category } from '@/shared/models/schemas/category.schema';
import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { TransformerInterface } from './transformer.interface';

export const categoryTransformer: TransformerInterface<Category[]> = ({
  value,
}: {
  value: Category[];
}) => {
  return value.map(({ label, status, main }) => {
    return new ResponseCategoryDTO(label, status, main);
  });
};

export const CategoryTransformers = () =>
  applyDecorators(Transform(categoryTransformer));
