import { Controller, Get, Param } from '@nestjs/common';
import {
  ApiBasicAuth,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PriceService } from './price.service';
import { UrlValidator } from '@/shared/validators/urlValidator.dto';

@ApiBasicAuth()
@ApiTags('Price')
@Controller('price')
export class PriceController {
  constructor(private priceService: PriceService) {}

  @ApiOkResponse({
    description: 'Price found successfully.',
    // TODO: price response object
    type: Object,
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong while getting price.',
  })
  @ApiNotFoundResponse({
    description: 'Price not found.',
  })
  @Get(':id')
  async getPrice(@Param() param: UrlValidator) {
    return await this.priceService.getPrice(param);
  }
}
