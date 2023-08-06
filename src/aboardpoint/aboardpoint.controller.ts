import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AboardpointService } from './aboardpoint.service';
import { CreateAboardpointDto } from './dto/create-aboardpoint.dto';
import { UpdateAboardpointDto } from './dto/update-aboardpoint.dto';

@Controller('aboardpoint')
export class AboardpointController {
  constructor(private readonly aboardpointService: AboardpointService) {}

  @Post()
  create(@Body() createAboardpointDto: CreateAboardpointDto) {
    return this.aboardpointService.create(createAboardpointDto);
  }

  @Get()
  findAll() {
    return this.aboardpointService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.aboardpointService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAboardpointDto: UpdateAboardpointDto,
  ) {
    return this.aboardpointService.update(+id, updateAboardpointDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.aboardpointService.remove(+id);
  }
}
