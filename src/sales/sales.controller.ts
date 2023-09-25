import { Body, Controller, Post, Get, Param, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SalesService } from './sales.service';
import { CreateSaleDTO } from '@/shared/models/dtos/sales/createsales.dto';
import { UrlValidator } from '@/shared/validators/urlValidator.dto';
import { Public } from '@/auth/public.decorator';
import { PaginationDTO } from '@/shared/dtos/pagination.dto';
import { Sales } from '@/shared/models/schemas/sales.schema';
import { ApiPaginatedResponse } from '@/shared/decorators/api-paginated.response.dto';
import { PaginatedDTO } from '@/shared/dtos/paginated.dto';

@ApiBearerAuth()
@ApiTags('Sales')
@Controller('sales')
@ApiExtraModels(PaginatedDTO)
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

  // TODO: use proper response object
  @ApiPaginatedResponse(Sales)
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
  async salesByUser(
    @Param() param: UrlValidator,
    @Query() query: PaginationDTO,
  ) {
    return await this.salesService.salesByUser(param.id, query);
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
