import { Includeds } from '@/shared/models/schemas/included.schema';
import { TransformerInterface } from './transformer.interface';
import { Entry } from '@/shared/enums/entry.enum';
import { Transform } from 'class-transformer';
import { applyDecorators } from '@nestjs/common';
import { ResponseIncludedDTO } from '@/shared/models/dtos/response/included/responseIncluded.dto';

export const includedTransformer: TransformerInterface<Includeds[]> = ({
  value,
}: {
  value: Includeds[];
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
