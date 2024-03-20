import { PaginatedDTO } from '@/shared/dtos/paginated.dto';
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
  ApiBody,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { DepartureService } from './departure.service';
import { CreateDepartureDTO } from '@/shared/models/dtos/departure/createdeparture.dto';
import { ResponseDepartureDTO } from '@/shared/models/dtos/departure/responsedeparture.dto';
import { ApiPaginatedResponse } from '@/shared/decorators/api-paginated.response.dto';
import { QueryDTO } from '@/shared/dtos/query.dto';
import { PaginateResult } from '@/shared/interfaces/paginate.interface';
import { Public } from '@/auth/public.decorator';
import { UrlValidator } from '@/shared/validators/urlValidator.dto';
import { UpdateDepartureDTO } from '@/shared/models/dtos/departure/updatedeparture.dto';

@Controller('departure')
@ApiTags('Departure')
@ApiExtraModels(PaginatedDTO)
export class DepartureController {
  constructor(private departureService: DepartureService) {}

  @ApiCreatedResponse({
    description: 'Departure created.',
    type: ResponseDepartureDTO,
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong creating departure.',
  })
  @ApiBody({ type: CreateDepartureDTO })
  @Post('create')
  async createDeparture(@Body() body: CreateDepartureDTO) {
    return await this.departureService.create(body);
  }

  @ApiPaginatedResponse(ResponseDepartureDTO)
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong finding departures.',
  })
  @ApiNotFoundResponse({
    description: 'Departures not found.',
  })
  @Public()
  @Get()
  async getDepartures(
    @Query() query: QueryDTO,
  ): Promise<PaginateResult<ResponseDepartureDTO>> {
    return await this.departureService.findAll(query);
  }

  @ApiOkResponse({
    description: 'Departure found.',
    type: ResponseDepartureDTO,
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong finding departure.',
  })
  @ApiNotFoundResponse({
    description: 'Departure not found.',
  })
  @Public()
  @Get(':id')
  async getDeparture(@Param() param: UrlValidator) {
    return await this.departureService.findOne(param);
  }

  @ApiOkResponse({
    description: 'Departure updated.',
    type: ResponseDepartureDTO,
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong updating departure.',
  })
  @ApiNotFoundResponse({
    description: 'Departure not found.',
  })
  @ApiBody({ type: UpdateDepartureDTO })
  @Put(':id')
  async updateDeparture(
    @Param() param: UrlValidator,
    @Body() body: UpdateDepartureDTO,
  ) {
    return await this.departureService.update(param, body);
  }

  @ApiOkResponse({
    description: 'Departure deleted.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong deleting departure.',
  })
  @ApiNotFoundResponse({
    description: 'Departure not found.',
  })
  @Delete(':id')
  async deleteDeparture(@Param() param: UrlValidator) {
    await this.departureService.delete(param);
  }

  @ApiOkResponse({
    description: 'Departure has been reactivated.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong reactivating departure.',
  })
  @ApiNotFoundResponse({
    description: 'Departure not found.',
  })
  @Patch('reactivate/:id')
  async reactivateDeparture(@Param() param: UrlValidator) {
    await this.departureService.reactivate(param);
  }
}
