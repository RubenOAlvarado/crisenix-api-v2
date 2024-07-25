import { Includeds } from '@/shared/models/schemas/included.schema';
import { Entry } from '@/shared/enums/entry.enum';
import { Expose, Transform } from 'class-transformer';
import { applyDecorators } from '@nestjs/common';
import { ResponseIncludedDTO } from '@/shared/models/dtos/response/included/responseIncluded.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export const includedTransformer = ({ value }: { value: Includeds[] }) => {
  if (value?.length) {
    return value.map(({ concept, included, publish, entry, status }) => {
      return new ResponseIncludedDTO(
        concept,
        included,
        publish,
        entry as Entry,
        status,
      );
    });
  }
  return undefined;
};

export const IncludedTransformers = () =>
  applyDecorators(
    ApiPropertyOptional(),
    Expose(),
    Transform(includedTransformer),
  );
