import { AboardPoint } from '@/shared/models/schemas/aboarpoint.schema';
import { TransformerInterface } from './transformer.interface';
import { ResponseAboardPointDTO } from '@/shared/models/dtos/aboardpoint/responseaboardpoint.dto';
import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';

export const aboardPointsTransformer: TransformerInterface<AboardPoint[]> = ({
  value,
}: {
  value: AboardPoint[];
}) => {
  return value.map(({ name, status, createdAt }) => {
    return new ResponseAboardPointDTO(name, status, createdAt);
  });
};
export const AboardPointsTransformer = () =>
  applyDecorators(Transform(aboardPointsTransformer));
