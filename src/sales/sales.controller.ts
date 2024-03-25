import { Body, Controller, Post, Get, Param, Query, Req } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SalesService } from './sales.service';
import { UrlValidator } from '@/shared/validators/urlValidator.dto';
import { Public } from '@/auth/public.decorator';
import { PaginationDTO } from '@/shared/dtos/pagination.dto';
import { ApiPaginatedResponse } from '@/shared/decorators/api-paginated.response.dto';
import { PaginatedDTO } from '@/shared/dtos/paginated.dto';
import type { UserRequest } from '@/shared/interfaces/userRequest.interface';
import { ResponseSalesDTO } from '@/shared/models/dtos/response/sales/responsesales.dto';
import { CreateSaleDTO } from '@/shared/models/dtos/request/sales/createsales.dto';
import { ResponseSavedPaypalResponse } from '@/shared/models/dtos/response/sales/response-paypal.response.dto';
import { PaypalResponse } from '@/shared/models/dtos/response/sales/paypal.response.dto';
import { plainToInstance } from 'class-transformer';

@ApiBearerAuth()
@ApiTags('Sales')
@Controller('sales')
@ApiExtraModels(PaginatedDTO)
export class SalesController {
  constructor(private salesService: SalesService) {}

  @ApiCreatedResponse({
    description: 'Sale created successfully.',
    type: ResponseSalesDTO,
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong creating sale.',
  })
  @Post('create')
  @ApiBody({
    description: 'Sale object',
    type: CreateSaleDTO,
  })
  async createSale(
    @Body() createSaleDTO: CreateSaleDTO,
  ): Promise<ResponseSalesDTO> {
    const newSale = await this.salesService.create(createSaleDTO);
    return plainToInstance(ResponseSalesDTO, newSale);
  }

  @ApiPaginatedResponse(ResponseSalesDTO)
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
  ): Promise<PaginatedDTO<ResponseSalesDTO>> {
    const sales = await this.salesService.salesByUser(param.id, query);
    return plainToInstance(PaginatedDTO<ResponseSalesDTO>, sales);
  }

  @ApiOkResponse({
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
  ): Promise<ResponseSavedPaypalResponse> {
    return await this.salesService.paypalResponse(paypalResponse, req.user);
  }
}
