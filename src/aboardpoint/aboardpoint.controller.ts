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
import { plainToInstance } from 'class-transformer';

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
  async create(
    @Body() createAboardPointDTO: CreateAboardPointDTO,
  ): Promise<ResponseAboardPointDTO> {
    const aboardPoint = await this.service.create(createAboardPointDTO);
    return plainToInstance(ResponseAboardPointDTO, aboardPoint);
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
  async findAll(@Query() query: StatusDTO): Promise<ResponseAboardPointDTO[]> {
    const aboardPoints = await this.service.findAll(query);
    return plainToInstance(ResponseAboardPointDTO, aboardPoints);
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
  async findOne(@Param() param: UrlValidator): Promise<ResponseAboardPointDTO> {
    const aboardPoint = await this.service.findOne(param);
    return plainToInstance(ResponseAboardPointDTO, aboardPoint);
  }

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
    @Param() param: UrlValidator,
    @Body() updateAboardPointDTO: UpdateAboardPointDTO,
  ): Promise<ResponseAboardPointDTO> {
    const updatedaboardpoint = await this.service.update(
      param,
      updateAboardPointDTO,
    );
    return plainToInstance(ResponseAboardPointDTO, updatedaboardpoint);
  }

  @ApiOkResponse({
    description: 'The aboard point has been successfully deleted.',
    type: String,
  })
  @ApiNotFoundResponse({
    description: 'Aboard point not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong deleting the aboard point.',
  })
  @Delete(':id/delete')
  async delete(@Param() param: UrlValidator): Promise<string> {
    await this.service.delete(param);
    return 'The aboard point has been successfully deleted.';
  }

  @ApiOkResponse({
    description: 'The aboard point has been successfully reactivated.',
    type: String,
  })
  @ApiNotFoundResponse({
    description: 'Aboard point not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong reactivating the aboard point.',
  })
  @Patch('reactivate/:id')
  async reactivate(@Param() param: UrlValidator): Promise<string> {
    await this.service.reactivate(param);
    return 'The aboard point has been successfully reactivated.';
  }
}
