import { ItineraryDTO } from '@/shared/models/dtos/request/tour/itinerary.dto';
import { applyDecorators } from '@nestjs/common';
import { Expose, Transform } from 'class-transformer';
import { ResponseItineraryDTO } from '@/shared/models/dtos/response/tour/reponseitinerary.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export const itineraryTransformer = ({ value }: { value: ItineraryDTO[] }) => {
  if (value?.length) {
    return value.map(
      ({
        dayNumber,
        clasification,
        order,
        additionalCost,
        initDate,
        initHour,
        finishDate,
        finishHour,
        route,
      }) => {
        return new ResponseItineraryDTO(
          dayNumber,
          clasification,
          order,
          additionalCost,
          initDate,
          initHour,
          finishDate,
          finishHour,
          route,
        );
      },
    );
  }
  return undefined;
};

export const ItineraryTransformers = () =>
  applyDecorators(
    ApiPropertyOptional(),
    Expose(),
    Transform(itineraryTransformer),
  );
