import {
  // Body,
  Controller,
  /* Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query, */
} from '@nestjs/common';
/* import { PricesService } from './prices.service';
import { ResponsePriceDTO } from '@/shared/models/dtos/response/price/responseprice.dto';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { CreatePriceDTO } from '@/shared/models/dtos/request/price/createprice.dto';
import { StatusDTO } from '@/shared/dtos/statusparam.dto';
import { UrlValidator } from '@/shared/validators/urlValidator.dto';
import { UpdatePriceDTO } from '@/shared/models/dtos/request/price/updateprice.dto'; */
@Controller('prices')
export class PricesController {
  /* constructor(private pricesService: PricesService) {}

  @ApiCreatedResponse({
    type: ResponsePriceDTO,
    description: 'Price created successfully.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong creating Price.',
  })
  @Post('create')
  @ApiBody({ type: CreatePriceDTO })
  async createPrice(@Body() createPriceDTO: CreatePriceDTO) {
    // return await this.pricesService.createPrice(createPriceDTO);
  }

  @ApiOkResponse({
    type: ResponsePriceDTO,
    isArray: true,
    description: 'Prices found successfully.',
  })
  @ApiNotFoundResponse({ description: 'No Prices registered.' })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong looking Prices.',
  })
  @Get()
  async getAllPrices(@Query() query: StatusDTO) {
    return await this.pricesService.getPrice(query);
  }

  @ApiOkResponse({
    type: ResponsePriceDTO,
    description: 'Price found successfully.',
  })
  @ApiNotFoundResponse({ description: 'Price not found.' })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong looking Price.',
  })
  @Get(':id')
  async findPrice(@Param() params: UrlValidator) {
    return await this.pricesService.getPriceById(params);
  }

  @ApiOkResponse({
    type: ResponsePriceDTO,
    description: 'Price updated successfully.',
  })
  @ApiNotFoundResponse({ description: 'Price not found.' })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong updating Price.',
  })
  @Put(':id')
  @ApiBody({ type: UpdatePriceDTO })
  async updatePrice(
    @Body() updatePriceDTO: UpdatePriceDTO,
    @Param() params: UrlValidator,
  ) {
    return await this.pricesService.updatePrice(updatePriceDTO, params);
  }

  @ApiOkResponse({
    type: String,
    description: 'Price updated successfully.',
  })
  @ApiNotFoundResponse({ description: 'Price not found.' })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong updating Price.',
  })
  @ApiBadRequestResponse({ description: 'Price already inactive.' })
  @Delete(':id')
  async inactivePrice(@Param() params: UrlValidator) {
    await this.pricesService.inactivatePrice(params);
    return 'Price inactivated successfully.';
  }

  @ApiOkResponse({
    type: String,
    description: 'Price reactivated successfully.',
  })
  @ApiNotFoundResponse({ description: 'Price not found.' })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong reactivating Price.',
  })
  @ApiBadRequestResponse({ description: 'Price already active.' })
  @Patch('reactivate/:id')
  async reactivatePrice(@Param() params: UrlValidator) {
    await this.pricesService.reactivePrice(params);

    return 'Price reactivated successfully.';
  } */
}
