import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PriceService } from './price.service';
import { UrlValidator } from '@/shared/validators/urlValidator.dto';
import { Public } from '@/auth/public.decorator';
import { ResponsePriceDTO } from '@/shared/models/dtos/price/responseprice.dto';
import { CreatePriceDTO } from '@/shared/models/dtos/price/createprice.dto';
import { QueryDTO } from '@/shared/dtos/query.dto';
import { UpdatePriceDTO } from '@/shared/models/dtos/price/updateprice.dto';

@ApiTags('Price')
@Controller('price')
export class PriceController {
  constructor(private priceService: PriceService) {}

  @ApiCreatedResponse({
    description: 'Price created successfully.',
    type: ResponsePriceDTO,
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong while creating price.',
  })
  @Post('create')
  @ApiBody({
    description: 'Create price DTO',
    type: CreatePriceDTO,
  })
  async createPrice(@Body() createPriceDTO: CreatePriceDTO) {
    return await this.priceService.createPrice(createPriceDTO);
  }

  @ApiOkResponse({
    description: 'Price found successfully.',
    type: ResponsePriceDTO,
    isArray: true,
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong while getting prices.',
  })
  @ApiNotFoundResponse({
    description: 'Prices not found.',
  })
  @Public()
  @Get()
  async getPrices(@Query() queryDTO: QueryDTO) {
    return await this.priceService.getPrices(queryDTO);
  }

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

  @ApiOkResponse({
    description: 'Price updated successfully.',
    type: ResponsePriceDTO,
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong while updating price.',
  })
  @ApiNotFoundResponse({
    description: 'Price not found.',
  })
  @ApiBadRequestResponse({
    description: 'Invalid request.',
  })
  @ApiBody({
    description: 'Update price DTO',
    type: UpdatePriceDTO,
  })
  @Put(':id')
  async updatePrice(
    @Param() param: UrlValidator,
    @Body() updatePriceDTO: UpdatePriceDTO,
  ) {
    return await this.priceService.updatePrice(param, updatePriceDTO);
  }

  @ApiOkResponse({
    description: 'Price deleted successfully.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong while deleting price.',
  })
  @ApiNotFoundResponse({
    description: 'Price not found.',
  })
  @Delete('delete/:id')
  async deletePrice(@Param() param: UrlValidator) {
    await this.priceService.deletePrice(param);
  }

  @ApiOkResponse({
    description: 'Price activated successfully.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong while activating price.',
  })
  @ApiNotFoundResponse({
    description: 'Price not found.',
  })
  @Patch('reactivate/:id')
  async reactivatePrice(@Param() param: UrlValidator) {
    await this.priceService.reactivatePrice(param);
  }
}
