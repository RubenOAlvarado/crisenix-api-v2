import { AboardHourDTO } from '@/shared/models/dtos/tour/aboardhour.dto';
import { ResponseAboardHourDTO } from '@/shared/models/dtos/tour/responseaboardhour.dto';
import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';

export const aboardHourTransformer = ({
  value,
}: {
  value: AboardHourDTO[];
}) => {
  return value.map(({ hour, aboardPoint }) => {
    return new ResponseAboardHourDTO(hour, aboardPoint);
  });
};

export const AboardHourTransformer = () =>
  applyDecorators(Transform(aboardHourTransformer));
