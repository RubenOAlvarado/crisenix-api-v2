import { Entry } from '@/shared/enums/entry.enum';
import { Expose, Transform } from 'class-transformer';
import { applyDecorators } from '@nestjs/common';
import { ResponseIncludedDTO } from '@/shared/models/dtos/response/included/responseIncluded.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IncludedLean } from '@/shared/interfaces/included/included.lean.interface';

export const includedTransformer = ({ value }: { value: IncludedLean[] }) => {
  if (value?.length) {
    return value.map(({ concept, included, publish, entry, status, _id }) => {
      return new ResponseIncludedDTO(
        concept,
        included,
        publish,
        entry as Entry,
        status,
        _id.toHexString(),
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
