import { applyDecorators } from '@nestjs/common';
import { Expose, Transform } from 'class-transformer';
import { ResponseAboardHourDTO } from '@/shared/models/dtos/response/tour/responseaboardhour.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export const aboardHourTransformer = ({
  value,
}: {
  value: ResponseAboardHourDTO[];
}) => {
  if (value?.length) {
    return value.map(({ hour, aboardPoint }) => {
      return new ResponseAboardHourDTO(hour, aboardPoint);
    });
  }
  return undefined;
};

export const AboardHourTransformer = () =>
  applyDecorators(
    ApiPropertyOptional(),
    Expose(),
    Transform(aboardHourTransformer),
  );
