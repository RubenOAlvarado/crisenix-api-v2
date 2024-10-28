import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SalesService } from './sales.service';
import { CreateSaleDTO } from '@/shared/models/dtos/request/sales/createsales.dto';

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
}
