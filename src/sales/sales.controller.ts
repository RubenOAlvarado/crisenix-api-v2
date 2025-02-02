import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { SalesService } from './sales.service';
import { CreateSaleDTO } from '@/shared/models/dtos/request/sales/createsales.dto';
import { IdValidator } from '@/shared/models/dtos/validators/id.validator';
import { DeclineSaleDto } from '@/shared/models/dtos/request/sales/declineSale.dto';

@ApiBearerAuth()
@ApiTags('Sales')
@Controller('sales')
export class SalesController {
  constructor(private salesService: SalesService) {}

  @ApiOperation({ summary: 'Create a new sale' })
  @ApiCreatedResponse({
    description: 'Sale created successfully.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong creating sale.',
  })
  @Post()
  @ApiBody({
    description: 'Sale object',
    type: CreateSaleDTO,
  })
  async createSale(@Body() createSaleDTO: CreateSaleDTO) {
    return await this.salesService.create(createSaleDTO);
  }

  @ApiOperation({ summary: 'Mark sale as paid' })
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
  @Patch('pay')
  @ApiBody({
    description: 'Payment information',
    type: IdValidator,
  })
  async markSaleAsPaid(@Body() param: IdValidator) {
    return await this.salesService.markSaleAsPaid(param);
  }

  @ApiOperation({ summary: 'Mark sale as declined' })
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
  @Patch('decline')
  @ApiBody({
    description: 'Declined reason',
    type: DeclineSaleDto,
  })
  async markSaleAsDeclined(@Body() declineSaleDto: DeclineSaleDto) {
    return await this.salesService.markSaleAsDeclined(declineSaleDto);
  }

  @ApiOperation({ summary: 'Get all sales' })
  @ApiOkResponse({
    description: 'Sale found successfully.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong finding the sale.',
  })
  @Get(':id')
  async getSaleById(@Param() param: IdValidator) {
    return await this.salesService.findOne(param);
  }

  @ApiOperation({ summary: 'Get all sales by reservation id' })
  @ApiOkResponse({
    description: 'Sales found successfully.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong finding the sales by reservation id.',
  })
  @Get('reservation/:id')
  async getSaleByReservationId(@Param() param: IdValidator) {
    return await this.salesService.findSalesByReservationId(param);
  }
}
