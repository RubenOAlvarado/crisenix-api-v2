import { ResponseItineraryDTO } from '@/shared/models/dtos/itinerary/reponseitinerary.dto';
import { TransformerInterface } from './transformer.interface';
import { ItineraryDTO } from '@/shared/models/dtos/tour/itinerary.dto';
import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';

export const itineraryTransformer: TransformerInterface<ItineraryDTO[]> = ({
  value,
}: {
  value: ItineraryDTO[];
}) => {
  return value.map(({ dayNumber, activity, order }) => {
    return new ResponseItineraryDTO(dayNumber, activity, order);
  });
};

export const ItineraryTransformers = () =>
  applyDecorators(Transform(itineraryTransformer));
