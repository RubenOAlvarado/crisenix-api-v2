import { ClassificationLean } from '@/shared/types/classification/classification.lean.type';
import { ResponseClassificationDTO } from '@/shared/models/dtos/response/classifications/responseclassifications.dto';
import { handleDocumentsId } from '../helpers';
import { applyDecorators } from '@nestjs/common';
import { Expose, Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export const classificationsTransformer = ({
  value,
}: {
  value: ClassificationLean[];
}) => {
  if (value?.length) {
    return value.map(({ name, description, status, _id }) => {
      return new ResponseClassificationDTO(
        name,
        handleDocumentsId(_id),
        description,
        status,
      );
    });
  }
  return undefined;
};

export const ClassificationTransformers = () =>
  applyDecorators(
    ApiPropertyOptional(),
    Expose(),
    Transform(classificationsTransformer),
  );
