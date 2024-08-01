import { applyDecorators } from '@nestjs/common';
import { Expose, Transform } from 'class-transformer';
import { ResponseTransferTypeDTO } from '@/shared/models/dtos/response/translationType/responseTranslationType.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { TransferTypeLean } from '@/shared/interfaces/transferType/transferType.lean.interface';
import { handleDocumentsId } from '../helpers';

export const transferTypeTransformer = ({
  value,
}: {
  value: TransferTypeLean[];
}) => {
  if (value?.length) {
    return value.map(({ name, status, _id }) => {
      return new ResponseTransferTypeDTO(name, status, handleDocumentsId(_id));
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
