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
import { AboardpointService } from './aboardpoint.service';
import { StatusDTO } from '@/shared/dtos/statusparam.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UrlValidator } from '../shared/validators/urlValidator.dto';
import { Public } from '@/auth/public.decorator';
import { ResponseAboardPointDTO } from '@/shared/models/dtos/response/aboardpoint/responseaboardpoint.dto';
import { CreateAboardPointDTO } from '@/shared/models/dtos/request/aboardpoint/createaboardpoint.dto';
import { UpdateAboardPointDTO } from '@/shared/models/dtos/request/aboardpoint/updateaboardpoint.dto';

@ApiTags('Aboard Point')
@ApiBearerAuth()
@Controller('aboardpoint')
export class AboardPointController {
  constructor(private service: AboardpointService) {}

  @ApiCreatedResponse({
    description: 'The aboard point has been successfully created.',
    type: ResponseAboardPointDTO,
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong creating the aboard point.',
  })
  @Post('create')
  @ApiBody({
    description: 'Aboard point object',
    type: CreateAboardPointDTO,
  })
  async create(@Body() createAboardPointDTO: CreateAboardPointDTO) {
    return await this.service.create(createAboardPointDTO);
  }

  @ApiOkResponse({
    description: 'The aboard points has been successfully found.',
    type: ResponseAboardPointDTO,
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong finding the aboard points.',
  })
  @ApiNotFoundResponse({
    description: 'No aboard points registered.',
  })
  @Get()
  async findAll(@Query() query: StatusDTO) {
    return await this.service.findAll(query);
  }

  @ApiOkResponse({
    description: 'The aboard point has been found.',
    type: ResponseAboardPointDTO,
  })
  @ApiNotFoundResponse({
    description: 'Aboard point not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong finding the aboard point.',
  })
  @Public()
  @Get(':id')
  async findOne(@Param() param: UrlValidator) {
    return await this.service.findOne(param);
  }

  @ApiOkResponse({
    description: 'The aboard point has been successfully updated.',
  })
  @ApiNotFoundResponse({
    description: 'Aboard point not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong updating the aboard point.',
  })
  @Put(':id')
  @ApiBody({
    description: 'Aboard point object',
    type: UpdateAboardPointDTO,
  })
  async update(
    @Param() param: UrlValidator,
    @Body() updateAboardPointDTO: UpdateAboardPointDTO,
  ) {
    return await this.service.update(param, updateAboardPointDTO);
  }

  @ApiOkResponse({
    description: 'The aboard point has been successfully deleted.',
  })
  @ApiNotFoundResponse({
    description: 'Aboard point not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong deleting the aboard point.',
  })
  @Delete(':id/delete')
  async delete(@Param() param: UrlValidator) {
    await this.service.delete(param);
  }

  @ApiOkResponse({
    description: 'The aboard point has been successfully reactivated.',
  })
  @ApiNotFoundResponse({
    description: 'Aboard point not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong reactivating the aboard point.',
  })
  @Patch('reactivate/:id')
  async reactivate(@Param() param: UrlValidator) {
    await this.service.reactivate(param);
  }
}
