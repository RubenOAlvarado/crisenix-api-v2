import { ResponseTourDTO } from '@/shared/models/dtos/response/tour/responsetour.dto';
import { ResponseTourTypeDTO } from '@/shared/models/dtos/response/tourType/responseTourType.dto';
import { Tours } from '@/shared/models/schemas/tour.schema';
import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';

export const tourTransformer = ({ value }: { value: Tours[] }) => {
  return value.map(
    ({
      destination,
      code,
      seating,
      initDate,
      transport,
      returnDate,
      tourType,
    }) => {
      return new ResponseTourDTO(
        destination,
        code,
        seating,
        initDate,
        transport,
        returnDate,
        tourType as ResponseTourTypeDTO,
      );
    },
  );
};

export const TourTransformers = () =>
  applyDecorators(Transform(tourTransformer));
