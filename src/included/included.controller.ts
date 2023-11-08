import { PaginatedDTO } from '@/shared/dtos/paginated.dto';
import { Controller, Get, Param } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { IncludedService } from './included.service';
import { ResponseIncludedDTO } from '@/shared/models/dtos/included/responseIncluded.dto';
import { Public } from '@/auth/public.decorator';
import { UrlValidator } from '@/shared/validators/urlValidator.dto';
import { Entry } from '@/shared/enums/entry.enum';
import { HotelStatus } from '@/shared/enums/hotelstatus.enum';

@Controller('included')
@ApiTags('Included')
@ApiExtraModels(PaginatedDTO)
export class IncludedController {
  constructor(private readonly includedService: IncludedService) {}

  @ApiOkResponse({
    description: 'The included service has been found.',
    type: ResponseIncludedDTO,
  })
  @ApiNotFoundResponse({
    description: 'Included service not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong finding the included service.',
  })
  @Public()
  @Get(':id')
  async findOne(
    @Param() urlValidator: UrlValidator,
  ): Promise<ResponseIncludedDTO> {
    const included = await this.includedService.findOne(urlValidator);
    return {
      ...included,
      entry: included.entry as Entry,
      hotelStatus: included?.hotelStatus as HotelStatus,
    };
  }
}
