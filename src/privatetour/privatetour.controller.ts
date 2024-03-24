import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PrivatetourService } from './privatetour.service';
import { CreatePrivatetourDto } from '@/shared/models/dtos/request/privatetour/create-privatetour.dto';

@ApiBearerAuth()
@ApiTags('Private Tour')
@Controller('privatetour')
export class PrivatetourController {
  constructor(private privateTourService: PrivatetourService) {}

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
  @Post('create')
  async create(@Body() createPrivateTourDto: CreatePrivatetourDto) {
    return await this.privateTourService.create(createPrivateTourDto);
  }
}
