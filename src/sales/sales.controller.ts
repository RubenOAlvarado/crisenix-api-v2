import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
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
import { SalesService } from './sales.service';
import { CreateSaleDTO } from '@/shared/models/dtos/request/sales/createsales.dto';
import { UrlValidator } from '@/shared/validators/urlValidator.dto';
import { DeclineSaleDto } from '@/shared/models/dtos/request/sales/declineSale.dto';

@ApiBearerAuth()
@ApiTags('Sales')
@Controller('sales')
export class SalesController {
  constructor(private salesService: SalesService) {}

  @ApiCreatedResponse({
    description: 'Sale created successfully.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong creating sale.',
  })
  @Post('create')
  @ApiBody({
    description: 'Sale object',
    type: CreateSaleDTO,
  })
  async createSale(@Body() createSaleDTO: CreateSaleDTO) {
    return await this.salesService.create(createSaleDTO);
  }

  @ApiOkResponse({
    description: 'Sale found successfully.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong finding the sale.',
  })
  @Get(':id')
  async getSaleById(@Param() param: UrlValidator) {
    return await this.salesService.findOne(param);
  }

  @ApiOkResponse({
    description: 'Sales found successfully.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong finding the sales by reservation id.',
  })
  @Get('reservation/:id')
  async getSaleByReservationId(@Param() param: UrlValidator) {
    return await this.salesService.findSalesByReservationId(param);
  }

  @ApiOkResponse({
    description: 'Sale marked as paid successfully.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong marking the sale as paid.',
  })
  @ApiNotFoundResponse({
    description: 'Sale not found.',
  })
  @ApiBadRequestResponse({
    description: 'Sale already paid.',
  })
  @Patch('mark-as-paid/:id')
  async markSaleAsPaid(@Param() param: UrlValidator) {
    return await this.salesService.markSaleAsPaid(param);
  }

  @ApiOkResponse({
    description: 'Sale marked as declined successfully.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong marking the sale as declined.',
  })
  @ApiNotFoundResponse({
    description: 'Sale not found.',
  })
  @ApiBadRequestResponse({
    description: 'Sale already declined.',
  })
  @Patch('mark-as-declined/:id')
  @ApiBody({
    description: 'Declined reason',
    type: DeclineSaleDto,
  })
  async markSaleAsDeclined(
    @Param() param: UrlValidator,
    @Body() declineSaleDto: DeclineSaleDto,
  ) {
    return await this.salesService.markSaleAsDeclined(param, declineSaleDto);
  }
}
