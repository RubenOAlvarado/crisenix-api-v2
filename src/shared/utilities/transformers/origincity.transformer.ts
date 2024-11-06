import { applyDecorators } from '@nestjs/common';
import { Expose, Transform } from 'class-transformer';
import { ResponseOriginCityDTO } from '@/shared/models/dtos/response/origincity/responseorigincity.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { OriginCityLean } from '@/shared/types/origincity/originCity.lean.type';
import { handleDocumentsId } from '../helpers';

export const originCityTransformer = ({
  value,
}: {
  value: OriginCityLean[];
}) => {
  if (value?.length) {
    return value.map(({ state, name, status, _id }) => {
      return new ResponseOriginCityDTO(
        state,
        name,
        status,
        handleDocumentsId(_id),
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
