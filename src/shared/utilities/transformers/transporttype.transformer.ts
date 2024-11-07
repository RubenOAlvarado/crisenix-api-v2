import { applyDecorators } from '@nestjs/common';
import { Expose, Transform } from 'class-transformer';
import { ResponseTransportTypeDTO } from '@/shared/models/dtos/response/translationType/responseTranslationType.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { handleDocumentsId } from '../helpers';
import { TransportTypeLean } from '@/shared/types/transportType/transportType.lean.type';

export const TransportTypeTransformer = ({
  value,
}: {
  value: TransportTypeLean[];
}) => {
  if (value?.length) {
    return value.map(({ name, status, _id }) => {
      return new ResponseTransportTypeDTO(name, status, handleDocumentsId(_id));
    });
  }
  return undefined;
};

export const TransportTypeTransformers = () =>
  applyDecorators(
    ApiPropertyOptional(),
    Expose(),
    Transform(TransportTypeTransformer),
  );
