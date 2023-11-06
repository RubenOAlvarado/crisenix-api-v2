import { ResponseAboardHourDTO } from '@/shared/models/dtos/tour/responseaboardhour.dto';
import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { TransformerInterface } from './transformer.interface';

export const aboardHourTransformer: TransformerInterface<
  ResponseAboardHourDTO[]
> = ({ value }: { value: ResponseAboardHourDTO[] }) => {
  return value.map(({ hour, aboardPoint }) => {
    return new ResponseAboardHourDTO(hour, aboardPoint);
  });
};

export const AboardHourTransformer = () =>
  applyDecorators(Transform(aboardHourTransformer));
