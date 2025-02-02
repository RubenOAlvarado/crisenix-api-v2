import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { PrivatetourService } from './privatetour.service';
import { CreatePrivatetourDto } from '@/shared/models/dtos/request/privatetour/create-privatetour.dto';

@ApiBearerAuth()
@ApiTags('Private Tour')
@Controller('private-tours')
export class PrivatetourController {
  constructor(private privateTourService: PrivatetourService) {}

  @ApiOperation({ summary: 'Create a new private tour' })
  @ApiCreatedResponse({
    description: 'Private Tour created successfully.',
    type: CreatePrivatetourDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong creating the private tour.',
  })
  @ApiBody({
    description: 'Private Tour object',
    type: CreatePrivatetourDto,
  })
  @Post()
  async create(@Body() createPrivateTourDto: CreatePrivatetourDto) {
    return await this.privateTourService.create(createPrivateTourDto);
  }
}
