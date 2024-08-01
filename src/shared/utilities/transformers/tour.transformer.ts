import { TourLean } from '@/shared/interfaces/tour/tour.lean.interface';
import { ResponseTourDTO } from '@/shared/models/dtos/response/tour/responsetour.dto';
import { ResponseTourTypeDTO } from '@/shared/models/dtos/response/tourType/responseTourType.dto';
import { applyDecorators } from '@nestjs/common';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { handleDocumentsId } from '../helpers';
import { ResponsePriceDTO } from '@/shared/models/dtos/response/price/responseprice.dto';
import { ResponseIncludedDTO } from '@/shared/models/dtos/response/included/responseIncluded.dto';
import { ResponseItineraryDTO } from '@/shared/models/dtos/response/tour/reponseitinerary.dto';

export const tourTransformer = ({ value }: { value: TourLean[] }) => {
  if (value?.length) {
    return value.map(
      ({
        destination,
        code,
        seating,
        initDate,
        transport,
        returnDate,
        tourType,
        status,
        boxLunch,
        availableSeat,
        ocuppiedSeat,
        aboardHour,
        days,
        nights,
        returnHour,
        coordinators,
        front,
        recommendations,
        includeds,
        itineraries,
        prices,
        _id,
      }) => {
        return new ResponseTourDTO(
          destination,
          code,
          seating,
          initDate,
          transport,
          returnDate,
          tourType as ResponseTourTypeDTO,
          prices as ResponsePriceDTO[],
          status,
          handleDocumentsId(_id),
          boxLunch,
          availableSeat,
          ocuppiedSeat,
          aboardHour,
          days,
          nights,
          returnHour,
          coordinators,
          front,
          recommendations,
          includeds as ResponseIncludedDTO[],
          itineraries as ResponseItineraryDTO[],
        );
      },
    );
  }
  return undefined;
};

export const TourTransformers = () =>
  applyDecorators(ApiPropertyOptional(), Expose(), Transform(tourTransformer));
