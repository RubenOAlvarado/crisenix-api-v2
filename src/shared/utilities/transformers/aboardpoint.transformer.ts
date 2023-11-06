import { AboardPoints } from '@/shared/models/schemas/aboarpoint.schema';
import { TransformerInterface } from './transformer.interface';
import { ResponseAboardPointDTO } from '@/shared/models/dtos/aboardpoint/responseaboardpoint.dto';
import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';

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
  applyDecorators(Transform(aboardPointsTransformer));
