import { TransferTypes } from '@/shared/models/schemas/transfertype.schema';
import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { TransformerInterface } from './transformer.interface';
import { ResponseTransferTypeDTO } from '@/shared/models/dtos/response/translationType/responseTranslationType.dto';

export const transferTypeTransformer: TransformerInterface<TransferTypes[]> = ({
  value,
}: {
  value: TransferTypes[];
}) => {
  return value.map(({ name, status }) => {
    return new ResponseTransferTypeDTO(name, status);
  });
};

export const TranslationTypeTransformers = () => {
  return applyDecorators(Transform(transferTypeTransformer));
};
