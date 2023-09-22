import { Body, Controller, Post, Get, Param } from '@nestjs/common';
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
import { CreateSaleDTO } from '@/shared/models/dtos/sales/createsales.dto';
import { UrlValidator } from '@/shared/validators/urlValidator.dto';
import { Public } from '@/auth/public.decorator';

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
    description: 'Sales found successfully.',
    // TODO: Add type and create response object
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong finding user sales.',
  })
  @ApiNotFoundResponse({
    description: 'User not found.',
  })
  @ApiBadRequestResponse({
    description: 'User does not have sales registered.',
  })
  @Public()
  @Get('salesByUser/:id')
  async salesByUser(@Param() param: UrlValidator) {
    return await this.salesService.salesByUser(param.id);
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
