import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { PricesService } from './prices.service';
import { ResponsePriceDTO } from '@/shared/models/dtos/response/price/responseprice.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreatePriceDTO } from '@/shared/models/dtos/request/price/createprice.dto';
import { IdValidator } from '@/shared/models/dtos/validators/id.validator';
import { UpdatePriceDTO } from '@/shared/models/dtos/request/price/updateprice.dto';
import { Public } from '@/auth/public.decorator';
@ApiBearerAuth()
@ApiTags('Prices')
@Controller('prices')
export class PricesController {
  constructor(private pricesService: PricesService) {}

  @ApiCreatedResponse({
    type: ResponsePriceDTO,
    description: 'Price created successfully.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong creating Price.',
  })
  @Post()
  @ApiBody({ type: CreatePriceDTO, description: 'Price object' })
  async createPrice(@Body() createPriceDTO: CreatePriceDTO) {
    return await this.pricesService.createPrice(createPriceDTO);
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
  @Public()
  @Get()
  async getAllPrices() {
    return await this.pricesService.getPrices();
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
  async findPrice(@Param() params: IdValidator) {
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
    @Param() params: IdValidator,
  ) {
    return await this.pricesService.updatePrice(params, updatePriceDTO);
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
  async inactivePrice(@Param() params: IdValidator) {
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
  async reactivatePrice(@Param() params: IdValidator) {
    await this.pricesService.reactivatePrice(params);

    return 'Price reactivated successfully.';
  }
}
