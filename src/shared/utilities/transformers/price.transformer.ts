import { Expose, Transform } from 'class-transformer';
import { applyDecorators } from '@nestjs/common';
import { ApiPropertyOptional } from '@nestjs/swagger';

export const priceTransformer = () => {
  return undefined;
};

export const PriceTransformers = () =>
  applyDecorators(ApiPropertyOptional(), Expose(), Transform(priceTransformer));
