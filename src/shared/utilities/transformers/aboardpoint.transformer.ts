import { AboardPoints } from '@/shared/models/schemas/aboarpoint.schema';
import { TransformerInterface } from './transformer.interface';
import { applyDecorators } from '@nestjs/common';
import { Expose, Transform } from 'class-transformer';
import { ResponseAboardPointDTO } from '@/shared/models/dtos/response/aboardpoint/responseaboardpoint.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export const aboardPointsTransformer: TransformerInterface<AboardPoints[]> = ({
  value,
}: {
  value: AboardPoints[];
}) => {
  return value.map(({ name, status }) => {
    return new ResponseAboardPointDTO(name, status);
  });
};
export const AboardPointsTransformer = () =>
  applyDecorators(
    ApiPropertyOptional(),
    Expose(),
    Transform(aboardPointsTransformer),
  );
