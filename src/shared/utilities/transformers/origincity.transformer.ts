import { OriginCities } from '@/shared/models/schemas/origincity.schema';
import { applyDecorators } from '@nestjs/common';
import { Expose, Transform } from 'class-transformer';
import { ResponseOriginCityDTO } from '@/shared/models/dtos/response/origincity/responseorigincity.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export const originCityTransformer = ({ value }: { value: OriginCities[] }) => {
  if (value?.length) {
    return value.map(({ state, name, status }) => {
      return new ResponseOriginCityDTO(state, name, status);
    });
  }
  return undefined;
};

export const OriginCityTransformers = () =>
  applyDecorators(
    ApiPropertyOptional(),
    Expose(),
    Transform(originCityTransformer),
  );
