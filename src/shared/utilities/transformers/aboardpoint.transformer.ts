import { applyDecorators } from '@nestjs/common';
import { Expose, Transform } from 'class-transformer';
import { ResponseAboardPointDTO } from '@/shared/models/dtos/response/aboardpoint/responseaboardpoint.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { AboardPointLean } from '@/shared/interfaces/aboardPoint/aboardPoint.lean.interface';
import { handleDocumentsId } from '../helpers';

export const aboardPointsTransformer = ({
  value,
}: {
  value: AboardPointLean[];
}) => {
  if (value?.length) {
    return value.map(({ name, status, _id }) => {
      return new ResponseAboardPointDTO(name, status, handleDocumentsId(_id));
    });
  }
  return undefined;
};
export const AboardPointsTransformer = () =>
  applyDecorators(
    ApiPropertyOptional(),
    Expose(),
    Transform(aboardPointsTransformer),
  );
