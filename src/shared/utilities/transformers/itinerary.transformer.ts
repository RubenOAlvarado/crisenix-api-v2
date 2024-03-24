import { ItineraryDTO } from '@/shared/models/dtos/request/tour/itinerary.dto';
import { TransformerInterface } from './transformer.interface';
import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { ResponseItineraryDTO } from '@/shared/models/dtos/response/tour/reponseitinerary.dto';

export const itineraryTransformer: TransformerInterface<ItineraryDTO[]> = ({
  value,
}: {
  value: ItineraryDTO[];
}) => {
  return value.map(({ dayNumber, clasification, order }) => {
    return new ResponseItineraryDTO(dayNumber, clasification, order);
  });
};

export const ItineraryTransformers = () =>
  applyDecorators(Transform(itineraryTransformer));
