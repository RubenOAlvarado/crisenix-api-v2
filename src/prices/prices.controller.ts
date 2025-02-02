import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { PricesService } from './prices.service';
import { ResponsePriceDTO } from '@/shared/models/dtos/response/price/responseprice.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
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

  @ApiOperation({ summary: 'Create a new Price' })
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

  @ApiOperation({ summary: 'Get all Prices' })
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

  @ApiOperation({ summary: 'Get Price by id' })
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

  @ApiOperation({ summary: 'Update Price' })
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
}
