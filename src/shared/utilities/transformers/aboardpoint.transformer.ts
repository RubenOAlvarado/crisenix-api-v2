import { AboardPoints } from '@/shared/models/schemas/aboarpoint.schema';
import { applyDecorators } from '@nestjs/common';
import { Expose, Transform } from 'class-transformer';
import { ResponseAboardPointDTO } from '@/shared/models/dtos/response/aboardpoint/responseaboardpoint.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export const aboardPointsTransformer = ({
  value,
}: {
  value: AboardPoints[];
}) => {
  if (value?.length) {
    return value.map(({ name, status }) => {
      return new ResponseAboardPointDTO(name, status);
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
