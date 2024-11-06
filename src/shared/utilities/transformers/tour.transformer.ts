/* import { TourLean } from '@/shared/types/tour/tour.lean.type';
import { ResponseTourDTO } from '@/shared/models/dtos/response/tour/responsetour.dto';
import { ResponseTourTypeDTO } from '@/shared/models/dtos/response/tourType/responseTourType.dto';
import { applyDecorators } from '@nestjs/common';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { handleDocumentsId } from '../helpers';
import { ResponsePriceDTO } from '@/shared/models/dtos/response/price/responseprice.dto';

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
        availableSeat,
        ocuppiedSeat,
        aboardHour,
        days,
        nights,
        returnHour,
        coordinators,
        front,
        recommendations,
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
          status,
          handleDocumentsId(_id),
          availableSeat,
          ocuppiedSeat,
          aboardHour,
          days,
          nights,
          returnHour,
          coordinators,
          front,
          recommendations,
        );
      },
    );
  }
  return undefined;
};

export const TourTransformers = () =>
  applyDecorators(ApiPropertyOptional(), Expose(), Transform(tourTransformer));
 */
