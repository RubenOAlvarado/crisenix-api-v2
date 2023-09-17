import { PaginatedDTO } from '@/shared/dtos/paginated.dto';
import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SalerService } from './saler.service';
import { QueryDTO } from '@/shared/dtos/query.dto';
import { PaginateResult } from '@/shared/interfaces/paginate.interface';
import { Public } from '@/auth/public.decorator';
import { Salers } from '@/shared/models/schemas/saler.schema';

@ApiTags('Saler')
@Controller('saler')
@ApiExtraModels(PaginatedDTO)
export class SalerController {
  constructor(private readonly salerService: SalerService) {}

  @ApiOkResponse({
    description: 'Paginated salers response.',
  })
  @ApiNotFoundResponse({
    description: 'No salers registered.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong finding the salers.',
  })
  @Public()
  @Get()
  async findAll(@Query() queryDTO: QueryDTO): Promise<PaginateResult<Salers>> {
    return await this.salerService.findAll(queryDTO);
  }
}
