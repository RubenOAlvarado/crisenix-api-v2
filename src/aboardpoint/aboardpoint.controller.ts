import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { AboardpointService } from './aboardpoint.service';
import { StatusDTO } from '@/shared/models/dtos/searcher/statusparam.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { IdValidator } from '../shared/models/dtos/validators/id.validator';
import { Public } from '@/auth/public.decorator';
import { ResponseAboardPointDTO } from '@/shared/models/dtos/response/aboardpoint/responseaboardpoint.dto';
import { CreateAboardPointDTO } from '@/shared/models/dtos/request/aboardpoint/createaboardpoint.dto';
import { UpdateAboardPointDTO } from '@/shared/models/dtos/request/aboardpoint/updateaboardpoint.dto';

@ApiTags('Aboard Points')
@ApiBearerAuth()
@Controller('aboard-points')
export class AboardPointController {
  constructor(private service: AboardpointService) {}

  @ApiOperation({ summary: 'Create a new aboard point.' })
  @ApiCreatedResponse({
    description: 'The aboard point has been successfully created.',
    type: ResponseAboardPointDTO,
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong creating the aboard point.',
  })
  @Post()
  @ApiBody({
    description: 'Aboard point object',
    type: CreateAboardPointDTO,
  })
  async create(@Body() createAboardPointDTO: CreateAboardPointDTO) {
    return await this.service.create(createAboardPointDTO);
  }

  @ApiOperation({ summary: 'Find all aboard points.' })
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

  @ApiOperation({ summary: 'Find a aboard point by id.' })
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
  async findOne(@Param() param: IdValidator) {
    return await this.service.findOne(param);
  }

  @ApiOperation({ summary: 'Update a aboard point by id.' })
  @ApiOkResponse({
    description: 'The aboard point has been successfully updated.',
    type: ResponseAboardPointDTO,
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
    @Param() param: IdValidator,
    @Body() updateAboardPointDTO: UpdateAboardPointDTO,
  ) {
    const updatedAboardpoint = await this.service.update(
      param,
      updateAboardPointDTO,
    );
    return updatedAboardpoint;
  }

  @ApiOperation({ summary: 'Change a aboard point status by id.' })
  @ApiOkResponse({
    description: 'The aboard point status has been successfully changed.',
    type: String,
  })
  @ApiNotFoundResponse({
    description: 'Aboard point not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong deleting the aboard point.',
  })
  @ApiBadRequestResponse({
    description: 'Wrong status sended.',
  })
  @Patch(':id/changes-status')
  async delete(
    @Param() param: IdValidator,
    @Query() status: StatusDTO,
  ): Promise<string> {
    await this.service.changeStatus(param, status);
    return 'The aboard point status has been successfully changed.';
  }

  @ApiOperation({ summary: 'Find all aboard points for the origin city.' })
  @ApiOkResponse({
    description: 'The aboard points for the origin city has been found.',
  })
  @ApiNotFoundResponse({
    description: 'No aboard points registered for the origin city.',
  })
  @ApiInternalServerErrorResponse({
    description:
      'Something went wrong finding the aboard points for the origin city.',
  })
  @Public()
  @Get('origin-city/:id')
  async findByOriginCity(@Param() param: IdValidator) {
    return await this.service.findByOriginCity(param);
  }
}
