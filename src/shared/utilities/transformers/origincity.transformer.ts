import { OriginCity } from '@/shared/models/schemas/origincity.schema';
import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { TransformerInterface } from './transformer.interface';
import { ResponseOriginCityDTO } from '@/shared/models/dtos/response/origincity/responseorigincity.dto';

export const originCityTransformer: TransformerInterface<OriginCity[]> = ({
  value,
}: {
  value: OriginCity[];
}) => {
  return value.map(({ state, name, status, aboardPoints }) => {
    return new ResponseOriginCityDTO(state, name, status, aboardPoints);
  });
};

export const OriginCityTransformers = () =>
  applyDecorators(Transform(originCityTransformer));
