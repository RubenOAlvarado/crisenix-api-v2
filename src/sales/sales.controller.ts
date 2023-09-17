import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SalesService } from './sales.service';
import { CreateSaleDTO } from '@/shared/models/dtos/sales/createsales.dto';

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

  /* @ApiOkResponse({
    description: 'Paypal sale result.',
    type: ResponseSavedPaypalResponse,
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong saving sale response.',
  })
  @ApiNotFoundResponse({
    description: 'Sale or tour not found.',
  })
  @ApiBadRequestResponse({
    description: 'Sale or tour incorrect status.',
  })
  @Post('result')
  async paypalResult(
    @Body() paypalResponse: PaypalResponse,
    @Req() req: UserRequest,
  ) {
    return await this.salesService.paypalResponse(paypalResponse, req.user);
  } */
}
