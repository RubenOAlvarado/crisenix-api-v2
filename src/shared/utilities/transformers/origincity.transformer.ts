import { applyDecorators } from '@nestjs/common';
import { Expose, Transform } from 'class-transformer';
import { ResponseOriginCityDTO } from '@/shared/models/dtos/response/origincity/responseorigincity.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { OriginCityLean } from '@/shared/interfaces/origincity/originCity.lean.interface';

export const originCityTransformer = ({
  value,
}: {
  value: OriginCityLean[];
}) => {
  if (value?.length) {
    return value.map(({ state, name, status, _id, aboardPoints }) => {
      return new ResponseOriginCityDTO(
        state,
        name,
        status,
        _id.toHexString(),
        aboardPoints,
      );
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
