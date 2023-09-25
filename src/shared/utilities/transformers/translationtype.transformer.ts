import { ResponseTranslationTypeDTO } from '@/shared/models/dtos/translationType/responseTranslationType.dto';
import { TranslationTypes } from '@/shared/models/schemas/translationtype.schema';
import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';

export const translationTypeTransformer = ({
  value,
}: {
  value: TranslationTypes[];
}) => {
  return value.map(({ name, status }) => {
    return new ResponseTranslationTypeDTO(name, status);
  });
};

export const TranslationTypeTransformers = () => {
  return applyDecorators(Transform(translationTypeTransformer));
};