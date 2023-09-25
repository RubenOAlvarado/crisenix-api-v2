import { ResponseOriginCityDTO } from '@/shared/models/dtos/originCity/responseorigincity.dto';
import { OriginCity } from '@/shared/models/schemas/origincity.schema';
import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';

export const originCityTransformer = ({ value }: { value: OriginCity[] }) => {
  return value.map(({ state, name, status, aboardPoints }) => {
    return new ResponseOriginCityDTO(state, name, status, aboardPoints);
  });
};

export const OriginCityTransformers = () =>
  applyDecorators(Transform(originCityTransformer));
