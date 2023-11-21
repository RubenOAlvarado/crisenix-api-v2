import { PaginatedDTO } from '@/shared/dtos/paginated.dto';
import { ResponseDestinationDTO } from '@/shared/models/dtos/destination/responsedestination.dto';
import { UrlValidator } from '@/shared/validators/urlValidator.dto';
import { Controller, Get, Param, Body, Post } from '@nestjs/common';
import {
  ApiBody,
  ApiExtraModels,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { DestinationService } from './destination.service';
import { Public } from '@/auth/public.decorator';
import { SearcherDTO } from '@/shared/dtos/searcher.dto';

@Controller('destination')
@ApiTags('Destination')
@ApiExtraModels(PaginatedDTO)
export class DestinationController {
  constructor(private readonly destinationService: DestinationService) {}

  @ApiOkResponse({
    description: 'The destination has been found.',
    type: ResponseDestinationDTO,
  })
  @ApiNotFoundResponse({
    description: 'Destination not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong finding the destination.',
  })
  @Public()
  @Get(':id')
  async findOne(
    @Param() urlValidator: UrlValidator,
  ): Promise<ResponseDestinationDTO> {
    return await this.destinationService.findOne(urlValidator);
  }

  // TODO: improve this endpoint docs
  @ApiResponse({ status: 200 })
  @Post('/search')
  @ApiBody({ type: SearcherDTO })
  @Public()
  async search(@Body() searcherDTO: SearcherDTO) {
    return await this.destinationService.search(searcherDTO);
  }
}
