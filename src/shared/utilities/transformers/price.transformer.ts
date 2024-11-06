import { Expose, Transform } from 'class-transformer';
import { applyDecorators } from '@nestjs/common';
import { ResponsePriceDTO } from '@/shared/models/dtos/response/price/responseprice.dto';
import { Currency } from '@/shared/enums/currency.enum';
import { PricesLean } from '@/shared/types/prices/prices.lean.type';
import { handleDocumentsId } from '../helpers';
import { ApiPropertyOptional } from '@nestjs/swagger';

export const priceTransformer = ({ value }: { value: PricesLean[] }) => {
  if (value?.length) {
    return value.map(
      ({
        _id,
        city,
        currency,
        general,
        singleBase,
        tripleBase,
        quadrupleBase,
        minor,
        inapam,
      }) => {
        return new ResponsePriceDTO(
          city,
          currency as Currency,
          handleDocumentsId(_id),
          general,
          singleBase,
          tripleBase,
          quadrupleBase,
          minor,
          inapam,
        );
      },
    );
  }
  return undefined;
};

export const PriceTransformers = () =>
  applyDecorators(ApiPropertyOptional(), Expose(), Transform(priceTransformer));
