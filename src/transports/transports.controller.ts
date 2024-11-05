import { Controller, Get, Param } from '@nestjs/common';
import {
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { TransportsService } from './transports.service';
import { Public } from '@/auth/public.decorator';
import { IdValidator } from '@/shared/models/dtos/validators/id.validator';
import { CreateTransportsDTO } from '@/shared/models/dtos/request/transports/createtransports.dto';

@ApiTags('Transports')
@Controller('transports')
export class TransportsController {
  constructor(private transportsService: TransportsService) {}

  @ApiOkResponse({
    description: 'Transport found successfully.',
    type: CreateTransportsDTO,
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong getting transport.',
  })
  @ApiNotFoundResponse({
    description: 'Transport not found.',
  })
  @Public()
  @Get(':id')
  async getTransport(@Param() param: IdValidator) {
    return await this.transportsService.getTransport(param);
  }
}
