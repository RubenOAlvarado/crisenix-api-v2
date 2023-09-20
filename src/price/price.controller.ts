import { Controller, Get, Param } from '@nestjs/common';
import {
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PriceService } from './price.service';
import { UrlValidator } from '@/shared/validators/urlValidator.dto';
import { Public } from '@/auth/public.decorator';
import { ResponsePriceDTO } from '@/shared/models/dtos/price/responseprice.dto';

@ApiTags('Price')
@Controller('price')
export class PriceController {
  constructor(private priceService: PriceService) {}

  @ApiOkResponse({
    description: 'Price found successfully.',
    type: ResponsePriceDTO,
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong while getting price.',
  })
  @ApiNotFoundResponse({
    description: 'Price not found.',
  })
  @Public()
  @Get(':id')
  async getPrice(@Param() param: UrlValidator) {
    return await this.priceService.getPrice(param);
  }
}
