import { Included } from '@/shared/models/schemas/included.schema';
import { TransformerInterface } from './transformer.interface';
import { ResponseIncludedDTO } from '@/shared/models/dtos/included/responseIncluded.dto';
import { Entry } from '@/shared/enums/entry.enum';
import { Transform } from 'class-transformer';
import { applyDecorators } from '@nestjs/common';

export const includedTransformer: TransformerInterface<Included[]> = ({
  value,
}: {
  value: Included[];
}) => {
  return value.map(({ concept, included, publish, entry, status }) => {
    return new ResponseIncludedDTO(
      concept,
      included,
      publish,
      entry as Entry,
      status,
    );
  });
};

export const IncludedTransformers = () =>
  applyDecorators(Transform(includedTransformer));
