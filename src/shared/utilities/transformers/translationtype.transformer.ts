import { TransferTypes } from '@/shared/models/schemas/transfertype.schema';
import { applyDecorators } from '@nestjs/common';
import { Expose, Transform } from 'class-transformer';
import { ResponseTransferTypeDTO } from '@/shared/models/dtos/response/translationType/responseTranslationType.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export const transferTypeTransformer = ({
  value,
}: {
  value: TransferTypes[];
}) => {
  if (value?.length) {
    return value.map(({ name, status }) => {
      return new ResponseTransferTypeDTO(name, status);
    });
  }
  return undefined;
};

export const TranslationTypeTransformers = () =>
  applyDecorators(
    ApiPropertyOptional(),
    Expose(),
    Transform(transferTypeTransformer),
  );
