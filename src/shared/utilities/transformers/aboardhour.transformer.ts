import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { TransformerInterface } from './transformer.interface';
import { ResponseAboardHourDTO } from '@/shared/models/dtos/response/tour/responseaboardhour.dto';

export const aboardHourTransformer: TransformerInterface<
  ResponseAboardHourDTO[]
> = ({ value }: { value: ResponseAboardHourDTO[] }) => {
  return value.map(({ hour, aboardPoint }) => {
    return new ResponseAboardHourDTO(hour, aboardPoint);
  });
};

export const AboardHourTransformer = () =>
  applyDecorators(Transform(aboardHourTransformer));
