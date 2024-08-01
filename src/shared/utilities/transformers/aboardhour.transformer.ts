import { applyDecorators } from '@nestjs/common';
import { Expose, Transform } from 'class-transformer';
import { ResponseAboardHourDTO } from '@/shared/models/dtos/response/tour/responseaboardhour.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ResponseAboardPointDTO } from '@/shared/models/dtos/response/aboardpoint/responseaboardpoint.dto';
import { handleDocumentsId } from '../helpers';

export const aboardHourTransformer = ({
  value,
}: {
  value: ResponseAboardHourDTO[];
}) => {
  if (value?.length) {
    return value.map(({ hour, aboardPoint }) => {
      if (aboardPoint instanceof Object) {
        const { _id, name, status } = aboardPoint as ResponseAboardPointDTO;

        return new ResponseAboardHourDTO(hour, {
          _id: handleDocumentsId(_id),
          name,
          status,
        });
      }
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
