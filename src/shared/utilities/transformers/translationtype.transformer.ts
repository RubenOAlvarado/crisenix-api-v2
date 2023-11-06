import { ResponseTranslationTypeDTO } from '@/shared/models/dtos/translationType/responseTranslationType.dto';
import { TranslationTypes } from '@/shared/models/schemas/translationtype.schema';
import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { TransformerInterface } from './transformer.interface';

export const translationTypeTransformer: TransformerInterface<
  TranslationTypes[]
> = ({ value }: { value: TranslationTypes[] }) => {
  return value.map(({ name, status }) => {
    return new ResponseTranslationTypeDTO(name, status);
  });
};

export const TranslationTypeTransformers = () => {
  return applyDecorators(Transform(translationTypeTransformer));
};
