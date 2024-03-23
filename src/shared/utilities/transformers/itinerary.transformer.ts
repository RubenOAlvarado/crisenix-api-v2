import { ResponseItineraryDTO } from '@/shared/models/dtos/tour/reponseitinerary.dto';
import { TransformerInterface } from './transformer.interface';
import { ItineraryDTO } from '@/shared/models/dtos/tour/itinerary.dto';
import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';

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
